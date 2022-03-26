const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../auth/middleware/isLoggedIn");
const Games = require("../../db/models/game");
const Users = require("../../db/models/users");
router.get("/", isLoggedIn, async (req, res) => {
  console.log(`lobby auth`);
  // const count = await Games.getGameUserCount(gameId);
  Users.findByEmail(req.session.passport.user.email)
    .then((user) => {
      console.log(`found email`);
      res.render("authenticated/lobby", {
        title: "lobby",
        message: "this is the lobby",
        user_id: user[0].displayname,
        // userCount: count
      });
    })
    .catch(console.log);
});

router.post("/list-all-games", isLoggedIn, async (req, res) => {
  const io = req.app.get("io");
  const user = await Users.findByEmail(req.user);
  const user_id = user[0].id;
  Games.listAllGames(user_id)
    .then((allGames) => {
      res.json();
      io.emit("LOBBY_LOADED", allGames);
    })
    .catch(console.log);
});

router.post("/list-user-games", isLoggedIn, async (req, res) => {
  const io = req.app.get("io");
  const user = await Users.findByEmail(req.user);
  const user_id = user[0].id;
  Games.listUserGames(user_id)
    .then((userGames) => {
      res.json();
      io.emit("LOBBY_LOADED", userGames);
    })
    .catch(console.log);
});

router.post("/");

module.exports = router;
