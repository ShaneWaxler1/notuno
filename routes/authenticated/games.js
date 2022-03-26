const express = require("express");
const router = express.Router();
const Games = require("../../db/models/game");
const User = require("../../db/models/users");
const PlayerActions = require("../../db/models/playerActions");
const isLoggedIn = require("../../auth/middleware/isLoggedIn");

router.get("/:id", isLoggedIn, function (request, response) {
  const id = request.params.id;
  User.findByEmail(request.session.passport.user.email).then((user) => {
    console.log(`found email`);
    response.render("authenticated/gameboard", {
      id: id,
      user_id: user[0].displayname,
    });
  });
});

router.post("/create", async (request, response) => {
  // console.log("creating game", request.user);
  const user = await User.findByEmail(request.user);
  const user_id = user[0].id;

  const io = request.app.get("io");

  Games.create(user_id)
    .then((game_id) => {
      response.json({ game_id });
      io.emit("GAME_CREATED", { game_id });
    })
    .catch(console.log);
});

router.post("/:id/join", async (request, response) => {
  //check if game is full
  //check if user is authenticated
  // const user = await User.findByEmail(request.body.email)
  console.log("IN POST REQ");
  try {
    console.log("joining", request.session.passport.user.email);
    const user = await User.findByEmail(request.session.passport.user.email);
    const game_id = request.params.id;
    const user_id = user[0].id;
    const io = request.app.get("io");

    // const count = await Games.getGameUserCount(game_id);
    //get user_id from authentication mechanism...

    Games.join(user_id, game_id).then(({ id }) => {
      response.json({ id });
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/playgame", isLoggedIn, (request, response, next) => {
  response.render("authenticated/gameboard");
});

// /games/${gameid}/user/${userid}/move/${move}/

router.post(
  "/playMove/game/:gameId/move/:playerMove",
  async (request, response) => {
    const gameId = parseInt(request.params.gameId);
    const user = await User.findByEmail(request.user);
    const userId = user[0].id;
    const move = request.params.playerMove;
    console.log("move", move);
    const moveAsInt = parseInt(move.split(",")[0]);
    const io = request.app.get("io");

    console.log("moveasint", moveAsInt);

    if (moveAsInt > 0) {
      PlayerActions.playCard(gameId, userId, move)
        .then((allowed) => {
          // console.log("play card", allowed);
          io.emit("CARD_PLAYED", { allowed, gameId });
        })
        .catch(console.log);
    } else if (moveAsInt == 0) {
      await PlayerActions.drawCard(gameId, userId)
        .then((allowed) => {
          io.emit("CARD_DRAWN", { allowed, gameId });
        })
        .catch(console.log);
    }
    io.emit("GAME_STATE", { gameId });
    response.json();
  }
);
router.post(
  "/game-state/game/:gameID",
  async function (request, response, next) {
    const io = request.app.get("io");
    const gameId = request.params.gameID;
    try {
      const user = await User.findByEmail(request.user);
      const userId = user[0].id;
      PlayerActions.getGameState(gameId, userId)
        .then((state) => {
          response.json(state);
        })
        .catch(console.log);
    } catch (err) {
      console.error(err);
    }
    // console.log(gameStateJson);
    // response.json(gameStateJson);
  }
);

// router.post(
//   "/game-state/game/:gameID",
//   async function (request, response, next) {
//     const gameId = request.params.gameID;
//     const user = await User.findByEmail(request.user);
//     const userid = user[0].id;
//     const gameStateJson = await PlayerActions.getGameState(gameId, userid);
//     console.log(gameStateJson);
//     response.json(gameStateJson);
//   }
// );

module.exports = router;
