/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
const db = require("../connection");

const SELECT_USER_HAND = `SELECT * FROM game_cards WHERE user_id=$1 AND game_id=$2;`;
const GET_USER_HAND_COUNT = `SELECT COUNT(card_id) FROM game_cards WHERE user_id=$1 AND game_id=$2;`;
const SELECT_USER_CARD = `SELECT * FROM game_cards WHERE user_id=$1 AND game_id=$2 AND card_id=$3;`;
const UPDATE_DRAW = `UPDATE game_cards SET draw_pile=$1, user_id=NULL WHERE game_id=$2;`;
const DRAW_CARD = `UPDATE game_cards SET draw_pile='f', user_id=$1 WHERE game_id=$2 AND "order" = (SELECT MIN("order") FROM game_cards WHERE user_id IS NULL AND draw_pile='t' AND game_id=$2);`;
const REVERSE = `UPDATE games SET direction=$1 WHERE id=$2;`;
const DRAW_FOUR = `DO $do$ 
	BEGIN
		FOR i IN 1..4 LOOP 
			UPDATE game_cards SET user_id=$1, draw_pile='f' 
			WHERE game_id=$2 AND "order" = (SELECT MIN("order") FROM game_cards WHERE user_id IS NULL AND draw_pile='t' AND game_id=$2);
		END LOOP;
	END; 
	$do$;`;
const DRAW_TWO = `DO $do$ 
	BEGIN
		FOR i IN 1..2 LOOP 
			UPDATE game_cards SET user_id=$1, draw_pile='f'
			WHERE game_id=$2 AND "order" = (SELECT MIN("order") FROM game_cards WHERE user_id IS NULL AND draw_pile='t' AND game_id=$2);
		END LOOP;
	END; 
	$do$;`;

const SELECT_TOP_DECK_CARD = `SELECT * FROM game_cards WHERE game_id=$1 AND draw_pile='t' AND "order" = (SELECT MIN("order") FROM game_cards WHERE draw_pile='t' AND user_id IS NULL AND game_id=1);`;
const SELECT_DECK_CARDS = `SELECT * FROM game_cards WHERE game_id=$1 AND draw_pile='t';`;

const SELECT_CARD_FROM_CARDS = `SELECT * FROM cards WHERE id=$1;`;
const SELECT_CURRENT_CARD = `SELECT * FROM game_cards WHERE discarded='t' AND game_id=$1;`;

const populateHands = async (userId, gameId) => {
  const POPULATE_HANDS = `DO $do$ 
		BEGIN
		WITH g_cards AS (
			SELECT * FROM game_cards WHERE user_id IS NULL AND game_id=$2 ORDER BY "order" LIMIT 7 
			)
			UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND user_id IS NULL AND EXISTS(SELECT * FROM g_cards WHERE game_cards.order = g_cards.order);
			WITH g_cards AS (
				SELECT * FROM game_cards WHERE user_id=$1 AND game_id=$2 ORDER BY "order" LIMIT 7 
				)
				UPDATE game_cards SET draw_pile='f' WHERE user_id=$1 AND game_id=$2 AND EXISTS(SELECT * FROM g_cards WHERE game_cards.order = g_cards.order); 
				END; 
				$do$`;
  await db.query(POPULATE_HANDS, [userId, gameId]);
};
const CHECK_GAME_STARTED = `SELECT started FROM games WHERE id=$1;`;

const hasGameWinner = async (gameId) => {
  const SELECT_GAME_WINNER = `SELECT (SELECT winner FROM games WHERE id=${gameId}) as winner`;
  try {
    const winnerFlag = await db.one(SELECT_GAME_WINNER);
    if (winnerFlag.winner == null) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
  }
};

const isGameStarted = async (gameId) => {
  try {
    return await db.one(CHECK_GAME_STARTED, [gameId]);
  } catch (err) {
    console.error(err);
  }
};

const shuffle = (orders) => {
  var j;
  var temp;
  var l = orders.length;
  for (var i = l - 1; i > 0; i--) {
    j = getRandomInt(0, i);
    temp = orders[i].card_id;
    orders[i].card_id = orders[j].card_id;
    orders[j].card_id = temp;
  }
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const notAllCardsDrawn = async (gameid) => {
  return await db
    .query(
      "SELECT EXISTS(SELECT * FROM game_cards WHERE game_id=$1 AND draw_pile='t');",
      [gameid]
    )
    .then(([{ exists: val }]) => {
      return val;
    })
    .catch((e) => console.error(e));
};

const reshuffleDeck = async (gameId) => {
  return await notAllCardsDrawn(gameId)
    .then((notAllCardsDrawnFlag) => {
      if (notAllCardsDrawnFlag) {
        // console.log("you haven't drawn thru all cards yet...");
        return;
      }
      // console.log(
      //   "\n\n\n\n=================================\nyou've drawn thru all cards\n==================================\n\n\n"
      // );
      db.query(
        `SELECT card_id, "order" FROM game_cards WHERE draw_pile='f' AND user_id IS NULL AND discarded='f' AND game_id=${gameId}`
      ).then(async (cardOrders) => {
        // console.log("reshuffling deck...")
        const ogCardOrders = [...cardOrders];
        shuffle(cardOrders);
        for (let i = 0; i < cardOrders.length; i++) {
          await db.any(
            "UPDATE game_cards SET card_id=$1, id_of_wild=0, draw_pile='t' WHERE game_id=$2 AND \"order\"=$3",
            [cardOrders[i].card_id, gameId, cardOrders[i].order]
          );
        }
      });
    })
    .catch((e) => console.error(e));
};

const drawCard = async (gameId, userId) => {
  // console.log(`${userId} drawing card`);
  try {
    const gameStartFlag = await isGameStarted(gameId);
    await reshuffleDeck(gameId);
    if ((await isPlayerTurn(gameId, userId)) && gameStartFlag.started) {
      // console.log("drawing a card pt 2...");
      await db.query(DRAW_CARD, [userId, gameId]);
      // .then(console.log);
      // console.log("card drawn");
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  }
};

const userHasCard = async (userId, cardId, gameId) => {
  try {
    return db
      .query(
        "SELECT EXISTS(SELECT * FROM game_cards WHERE user_id=$1 AND card_id=$2 AND game_id=$3);",
        [userId, cardId, gameId]
      )
      .then(([{ exists: val }]) => val);
  } catch (err) {
    console.error(err);
  }
};

const playCard = async (gameId, userId, move) => {
  try {
    const gameStartFlag = await isGameStarted(gameId);

    if (!gameStartFlag.started) {
      console.log("game not started");
      return false;
    } else if (!(await isPlayerTurn(gameId, userId))) {
      console.log("not ur turn bro");
      return false;
    } else if (await hasGameWinner(gameId)) {
      // console.log("game has a winner");
      return false;
    }

    let moveSplit = move.split(",");
    let cardId = parseInt(moveSplit[0]);
    let idOfWild = 0;
    if (moveSplit.length > 1) {
      idOfWild = await idOfWildAction(gameId, cardId, moveSplit[1]);
    }

    // console.log("id of wild: ", idOfWild);

    const hasCard = await userHasCard(userId, cardId, gameId);
    // console.log("hasCard", hasCard);
    if (!hasCard) {
      // console.log("user does not have this card");
      return false;
    }

    let currentCard = await db.one(SELECT_CURRENT_CARD, [gameId]);
    let userCardType = await db.one(SELECT_CARD_FROM_CARDS, [
      cardId + idOfWild,
    ]);
    let currentCardType = await db.one(SELECT_CARD_FROM_CARDS, [
      currentCard.card_id + currentCard.id_of_wild,
    ]);

    let nextPlayerId = await getNextPlayerId(gameId, userId);

    if (isCardValid(userCardType, currentCardType)) {
      db.query(
        `UPDATE game_cards SET discarded='t', user_id=NULL WHERE user_id=${userId} AND card_id=${cardId} AND game_id=${gameId}`
      );
      db.query(
        `UPDATE game_cards SET discarded='f' WHERE game_id=${gameId} AND discarded='t'`
      );
      // console.log("card valid ✨");
    } else {
      // console.log("card invalid ❌");
      return false;
    }

    // * execute the card action
    await runCardAction(gameId, userId, nextPlayerId, userCardType);
    if (userCardType.displayname === "Reverse") {
      const oldPlayerId = nextPlayerId;
      nextPlayerId = await getNextPlayerId(gameId, userId);
      // console.log("After reverse next player id", nextPlayerId);
    }
    // console.log("current player id", userId);
    if (
      userCardType.displayname !== "Skip" ||
      userCardType.displayname !== "Draw 2" ||
      userCardType.displayname !== "Draw 4"
    ) {
      const nextPlayer = await setCurrentPlayer(gameId, userId, nextPlayerId);
    }
    const nextCard = await setCardInPlay(gameId, cardId);

    let numCards = await numCardsInUserHand(gameId, userId);
    // Win condition:
    if (numCards == 0) {
      db.query(`UPDATE games SET winner=${userId} WHERE id=${gameId}`);
    }
    // console.log("played card");
    return true;
  } catch (err) {
    console.error(err);
  }
};

//

const runCardAction = async (gameId, userId, nextPlayerId, userCardType) => {
  try {
    switch (userCardType.displayname) {
      case "Draw 2":
        await db.query(DRAW_TWO, [nextPlayerId, gameId]);
        skipNextPlayer(gameId, userId, nextPlayerId);
        break;
      case "Draw 4":
        await db.query(DRAW_FOUR, [nextPlayerId, gameId]);
        skipNextPlayer(gameId, userId, nextPlayerId);
        break;
      case "Reverse":
        await changeDirection(gameId);
        break;
      case "Skip":
        skipNextPlayer(gameId, userId, nextPlayerId);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const idOfWildAction = async (gameId, cardId, color) => {
  try {
    return await db
      .query("SELECT displayname FROM cards WHERE id=$1", [cardId])
      .then(([{ displayname: name }]) =>
        db.query(
          `SELECT id FROM cards WHERE color='${color}' AND displayname='${name}'`
        )
      )
      .then(([{ id: idOfWild }]) => {
        const newIdOfWild = idOfWild - cardId;
        // console.log("newIdOfWild", newIdOfWild);
        return db.query(
          `UPDATE game_cards SET id_of_wild=${newIdOfWild} WHERE game_id=${gameId} AND card_id=${cardId} RETURNING id_of_wild AS id;`
        );
      })
      .then(([{ id: val }]) => val)
      .catch((error) => console.error(error));
  } catch (err) {
    console.error(err);
  }
};

// When calling this function, you must call await since it returns a promise.
const numCardsInUserHand = async (gameid, userid) => {
  try {
    const numCards = await db.one(
      "SELECT COUNT(user_id) FROM game_cards WHERE game_id=${gameid} AND user_id=${userid}",
      {
        gameid,
        userid,
      }
    );
    return parseInt(numCards.count);
  } catch (err) {
    console.error(err);
  }
};

// You must await when calling (i.e. 'let state = await getGameState(gameid,userid);')
const getGameState = async (gameId, userId) => {
  const stateJSON = {};
  try {
    const cardsPromise = db
      .query(
        `SELECT card_id FROM game_cards WHERE game_id=${gameId} AND user_id=${userId}`
      )
      .then((cardids) =>
        cardids.map(({ card_id: id }) =>
          db
            .oneOrNone(`SELECT * FROM cards WHERE id=${id}`)
            .then((card) => card)
        )
      )
      .then((cardsFromID) => cardsFromID);
    const hand = await Promise.all(await cardsPromise);

    const topDiscard = await getCardInPlay(gameId);

    const opponentStatusPromise = await db
      .query(
        `SELECT user_id, \"order\" FROM game_users WHERE game_id=${gameId} AND user_id!=${userId} ORDER BY \"order\" ASC`
      )
      .then((userIds) =>
        userIds.map(async ({ user_id: id, order: ord }) => {
          const displayName = await displayNameFromID(id);
          const currPlayer = await isCurrentPlayer(id,gameId);
          return { uno: isUno(id, gameId), displayname: displayName, currentPlayer: currPlayer, order: ord };
        })
      )
      .then((val) => val);

    const opponentStatus = await Promise.all(await opponentStatusPromise);
    for (const el of opponentStatus) {
      el.uno = await el.uno;
    }

    const isTurn = await isCurrentPlayer(userId,gameId);

    // const currentPlayerID = await db
    //   .query(
    //     "SELECT user_id FROM game_users WHERE game_id=$1 AND current_player='t'",
    //     [gameId]
    //   )
    //   .then(([{ user_id: id }]) => id);

    // const displayName = await displayNameFromID(userId);

    stateJSON.currentClient = userId;
    // stateJSON.currentPlayer = displayName;
    stateJSON.hand = hand;
    stateJSON.isCurrentPlayerTurn = isTurn;
    stateJSON.opponentStatus = opponentStatus;
    stateJSON.discard = topDiscard;
    console.log(stateJSON)
    // console.log(stateJSON.isCurrentPlayerTurn);
  } catch (err) {
    console.error(err);
  }
  // console.log("in GameState()", stateJSON);
  return stateJSON;
};

const displayNameFromID = async (userId) => {
  return await db
      .query("SELECT displayname FROM users WHERE id=$1", [userId])
      .then(([{ displayname: val }]) => val);
};

const isCurrentPlayer = async (userId, gameId) => {
  return await db
    .query(
      "SELECT current_player FROM game_users WHERE user_id=$1 and game_id=$2",
      [userId, gameId]
    )
    .then(([{ current_player: val }]) => val);
}

const getCardInPlay = async (gameId) => {
  return await db
    .any(
      "SELECT card_id, id_of_wild FROM game_cards WHERE discarded='t' AND game_id=$1;",
      [gameId]
    )
    .then(([{ card_id: cid, id_of_wild: wid }]) => {
      try {
        return db.one("SELECT * FROM CARDS WHERE id=$1", [cid + wid]);
      } catch (err) {
        console.error(err);
      }
    });
};

const setCardInPlay = async (gameId, cardId) => {
  const SELECT_MAX_ORDER = `SELECT MAX("order") FROM game_cards WHERE game_id=${gameId}`;
  const maxOrder = await db.one(SELECT_MAX_ORDER);
  // const UPDATE_DISCARD = `UPDATE game_cards SET discarded='f', draw_pile='f', "order"=${
  //   maxOrder.max + 1
  // } WHERE game_id=${gameId} AND discarded='t';
  // UPDATE game_cards SET discarded='t', user_id=NULL WHERE game_id=${gameId} AND card_id=${cardId} RETURNING *;`;
  const UPDATE_DISCARD = `UPDATE game_cards SET discarded='f', draw_pile='f' WHERE game_id=${gameId} AND discarded='t';
	UPDATE game_cards SET discarded='t', user_id=NULL WHERE game_id=${gameId} AND card_id=${cardId} RETURNING *;`;
  return await db.query(UPDATE_DISCARD);
};

const changeDirection = async (gameId) => {
  try {
    const direction = await getDirection(gameId);
    const CHANGE_DIRECTION = `UPDATE games SET direction=$1 WHERE id=${gameId}`;
    direction === 0
      ? await db.query(CHANGE_DIRECTION, 1)
      : await db.query(CHANGE_DIRECTION, 0);
  } catch (err) {
    console.error(err);
  }
};

const getDirection = async (gameId) => {
  try {
    const SELECT_DIRECTION = `SELECT direction FROM games WHERE id=${gameId}`;
    const { direction } = await db.one(SELECT_DIRECTION, [gameId]);
    return direction;
  } catch (err) {
    console.error(err);
  }
};

const isPlayerTurn = async (gameId, userId) => {
  try {
    const { current_player } = await db.one(
      `SELECT current_player FROM game_users WHERE game_id=${gameId} AND user_id=${userId};`
    );
    if (current_player === undefined) {
      return false;
    }
    return current_player;
  } catch (err) {
    console.error(err);
  }
};

const isUno = async (userid, gameid) => {
  try {
    const numCards = await Promise.resolve(
      await numCardsInUserHand(gameid, userid)
    );
    return numCards == 1;
  } catch (err) {
    console.error(err);
  }
};

const getDeckCard = async (gameId) => {
  try {
    return await db.one(SELECT_TOP_DECK_CARD, [gameId]);
  } catch (err) {
    console.error(err);
  }
};

// * takes cards as card model objects
const isCardValid = (userCard, cardInPlay) => {
  try {
    return (
      userCard.color === cardInPlay.color ||
      userCard.displayname == cardInPlay.displayname ||
      isCardWild(userCard)
    );
  } catch (err) {
    console.error(err);
  }
};

const isCardWild = (userCard) => {
  try {
    return (
      userCard.displayname.toString() == "Wild" ||
      userCard.displayname.toString() == "Draw 4"
    );
  } catch (err) {
    console.error(err);
  }
};

const getGameOrder = async (gameId) => {
  const SELECT_ALL = `SELECT user_id, "order" FROM game_users WHERE game_id=${gameId};`;
  try {
    const order = await db.query(SELECT_ALL);
    // * returns an array of user_id, order objects
    return order;
  } catch (err) {
    console.error(err);
  }
};

const getUserOrder = async (gameId, userId) => {
  try {
    const gameOrder = await getGameOrder(gameId);
    const order = gameOrder.filter((user) => user.user_id === userId);
    return order[0].order;
  } catch (err) {
    console.error(err);
  }
};

const getNextPlayerId = async (gameId, userId) => {
  const SELECT_PLAYER = `SELECT user_id FROM game_users WHERE "order"=$1 AND game_id=${gameId};`;
  const direction = await getDirection(gameId);
  const order = await getUserOrder(gameId, userId);
  try {
    let nextPlayer = "";
    let newOrder;
    switch (direction) {
      case 0:
        newOrder = order + 1;
        nextPlayer =
          order !== 4
            ? await db.one(SELECT_PLAYER, [newOrder])
            : await db.one(SELECT_PLAYER, [1]);
        break;
      case 1:
        newOrder = order - 1;
        nextPlayer =
          order !== 1
            ? await db.one(SELECT_PLAYER, [newOrder])
            : await db.one(SELECT_PLAYER, [4]);
        break;
      default:
        // console.log("y u here?");
        break;
    }
    // console.log("next player", nextPlayer);
    return nextPlayer.user_id;
  } catch (err) {
    console.error(err);
  }
  // console.log("next player", nextPlayer);
};

const setCurrentPlayer = async (gameId, oldUserId, nextUserId) => {
  const UPDATE_CURRENT_PLAYER = `UPDATE game_users SET current_player='f' WHERE game_id=${gameId}; 
	UPDATE game_users SET current_player='t' WHERE game_id=${gameId} AND user_id=${nextUserId} RETURNING *; 
	`;
  try {
    return await db.one(UPDATE_CURRENT_PLAYER);
  } catch (err) {
    console.error(err);
  }
};

const skipNextPlayer = async (gameId, userId, nextPlayerId) => {
  const newNextPlayerId = await getNextPlayerId(gameId, nextPlayerId);
  try {
    const newPlayer = await setCurrentPlayer(gameId, userId, newNextPlayerId);
    // console.log("next player after skip", newPlayer);
  } catch (err) {
    console.error(err);
  }
};

const isFirstRound = async (gameId) => {
  const SELECT_CARD_29 = `SELECT (SELECT "order" FROM game_cards WHERE game_id=${gameId} AND "order"=29) AS "order"
	;`;
  const SELECT_MAX_ORDER = `SELECT MAX("order") FROM game_cards WHERE game_id=${gameId};`;
  try {
    const flag = await db.one(SELECT_MAX_ORDER);
    // console.log(flag);
    if (flag.max <= 107) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  populateHands,
  getCardInPlay,
  runCardAction,
  drawCard,
  playCard,
  getGameState,
  isFirstRound,
  getDeckCard,
  getDirection,
  getUserOrder,
  getNextPlayerId,
  isPlayerTurn,
};
