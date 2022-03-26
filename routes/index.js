const express = require("express");
const router = express.Router();
require("dotenv").config();

// chat
const {
  LOBBY,
  USER_JOINED,
  MESSAGE_SEND,
} = require("../src/constants/event.js");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", function (request, response, next) {
  response.render("unauthenticated/index", {
    title: "notuno",
    message: "landing page",
  });
});

router.post("/force-join/:name", (request, response) => {
  const io = request.app.get("io");
  const { name } = request.params;

  io.emit(USER_JOINED, { user: name, timestamp: Date.now() });
  response.json({ ok: true });
});

router.post("/force-message/:message", (request, response) => {
  const io = request.app.get("io");
  const { message } = request.params;

  io.emit(MESSAGE_SEND, { user: "anonymous", timestamp: Date.now(), message });
  response.json({ ok: true });
});

module.exports = router;
