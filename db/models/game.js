const db = require("../connection");
const {
  populateHands,
  isFirstRound,
  getCardInPlay,
  getNextPlayerId,
  runCardAction,
} = require("./playerActions");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffle(cards) {
  var j;
  var temp;
  var l = cards.length;
  for (var i = l - 1; i > 0; i--) {
    j = getRandomInt(0, i);
    temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
  // Prevent first card from being wild:
  while (cards[28].id > 100) {
    j = getRandomInt(0, cards.length - 1);
    temp = cards[28];
    cards[28] = cards[j];
    cards[j] = temp;
  }
}

const SELECT_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=${game_id}";

const INSERT_GAME_USER_ON_JOIN =
  'INSERT INTO game_users (game_id, user_id, "order") VALUES (${game_id}, ${user_id}, ${order}) RETURNING game_id AS id';

const INSERT_GAME_USER_ON_CREATE =
  'INSERT INTO game_users (game_id, user_id, "order", current_player) VALUES (${game_id}, ${user_id}, ${order}, true) RETURNING game_id AS id';

const INSERT_GAMES = "INSERT INTO games (direction) VALUES (0) RETURNING id";

const INSERT_GAME_CARDS =
  'INSERT INTO game_cards (card_id, game_id, user_id, "order") VALUES (${card_id}, ${game_id}, ${user_id}, ${order})';

const LIST_GAMES = "SELECT * FROM games WHERE started='f';";

const GET_USER_IN_GAMES_COUNT = `
	SELECT COUNT(*) FROM (SELECT DISTINCT user_id FROM game_users) AS count_users WHERE game_id=$1;
`;

const CHECK_GAME_STARTED = `SELECT started FROM games WHERE id=$1;`;

const create = async (user_id) => {
  try {
    // console.log("sql create", user_id);
    const { id } = await db.one(INSERT_GAMES);
    const game_id = id;
    // console.log("assigned id to game_id", game_id);
    await db.one(INSERT_GAME_USER_ON_CREATE, {
      game_id: game_id,
      user_id,
      order: 1,
    });
    // Get cards from lookup table
    let [game_id1, cards] = await Promise.all([
      game_id,
      db.any("SELECT * FROM cards"),
    ]);
    // Shuffle and insert
    let j = 0;
    let first108 = cards.slice(0, 108);
    shuffle(first108);
    const [{ id: id_3 }] = await Promise.all([
      game_id,
      ...first108.map((card) =>
        db.any(INSERT_GAME_CARDS, {
          card_id: card.id,
          game_id: game_id,
          user_id: null,
          order: j++,
        })
      ),
    ]);
    db.query(
      "UPDATE game_cards SET discarded='t', draw_pile='f' WHERE \"order\"=28 AND game_id=$1",
      [game_id]
    );
    populateHands(user_id, game_id);
    return game_id;
  } catch (err) {
    console.error(err);
  }
};

const isUserInGame = async (game_id, user_id) => {
  return await db
    .oneOrNone(
      `SELECT * FROM game_users WHERE game_id=${game_id} AND user_id=${user_id}`
    )
    .then((val) => {
      return val != null;
    });
};

// Inserts user into game_users table
// Q. for Jeff: Why is game_id being passed as a string?
const join = async (user_id, game_id) => {
  try {
    const inGameAlready = await isUserInGame(game_id, user_id);
    return await userCount(game_id).then(async (result) => {
      if (inGameAlready) {
        return { id: game_id };
      }
      if (result <= 3) {
        try {
          populateHands(user_id, game_id);
          const userJoin = await db.one(INSERT_GAME_USER_ON_JOIN, {
            game_id,
            user_id,
            order: result + 1,
          });
          if (result == 3) {
            db.query(`UPDATE games SET started='t' WHERE id=${game_id}`);
            if (await isFirstRound(game_id)) {
              // console.log("is first round", await isFirstRound(game_id));
              const firstCard = await getCardInPlay(game_id);
              const nextPlayerId = await getNextPlayerId(game_id, user_id);
              runCardAction(game_id, user_id, nextPlayerId, firstCard);
            }
          }
          return userJoin;
        } catch (err) {
          console.error(err);
        }
      }
      return { id: -1 };
    });
  } catch (err) {
    console.error(err);
  }
};

// userCount: Returns amount of users in a game as an int given the game_id
const userCount = (game_id) => {
  try {
    return db
      .one(SELECT_COUNT, {
        game_id,
      })
      .then(({ count }) => {
        return parseInt(count);
      });
  } catch (err) {
    console.error(err);
  }
};

const listAllGames = async (userId) => {
  try {
    const allGames = await db.any(LIST_GAMES);
    return allGames;
  } catch (err) {
    console.error(err);
  }
};

const listUserGames = async (userId) => {
  return await db
    .manyOrNone("SELECT id FROM games WHERE winner IS NULL")
    .then(async (ids) => {
      return await Promise.all(
        ids.map(async ({ id: gameId }) => {
          return await db
            .oneOrNone(
              "SELECT game_id FROM game_users WHERE game_id=$1 AND user_id=$2",
              [gameId, userId]
            )
            .then((result) => result);
        })
      );
    })
    .then((result) => result.filter(Boolean)) //remove all null entries
    .then(async (result) => {
      return await Promise.all(
        result.map(async ({ game_id: id }) => {
          return await db
            .oneOrNone("SELECT * FROM games WHERE id=$1", [id])
            .then((result) => result);
        })
      );
    })
    .catch(console.log);
};

const isGameStarted = async (gameId) => {
  try {
    return await db.one(CHECK_GAME_STARTED, [gameId]);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  create,
  join,
  userCount,
  listAllGames,
  listUserGames,
  isGameStarted,
};
