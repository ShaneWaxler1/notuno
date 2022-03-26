const socket = io();

const addGameToGameList = (game_id, game_started) => {
  const listElement = document.createElement("li");
  const gameLinkbutton = document.createElement("button");

  listElement.innerHTML = game_started
    ? `Game ${game_id} (In Progress)`
    : `Game ${game_id}`;
  gameLinkbutton.id = `game-${game_id}`;
  gameLinkbutton.innerText = "Join";
  gameLinkbutton.dataset.game_id = game_id;

  listElement.appendChild(gameLinkbutton);
  document.getElementById("game-list").appendChild(listElement);
};

socket.on("GAME_CREATED", ({ game_id }) => {
  addGameToGameList(game_id);
});

socket.on("LOBBY_LOADED", (games) => {
  document.getElementById("game-list").innerHTML = "";
  games.forEach((game) => {
    // console.log(game)
    addGameToGameList(game.id, game.started);
  });
});

document.getElementById("game-list").addEventListener("click", (event) => {
  event.preventDefault();

  const { game_id } = event.target.dataset;
  if (game_id !== undefined) {
    fetch(`/games/${game_id}/join`, { method: "post" })
      .then((_response) => {
        window.location.assign(`/games/${game_id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

document.getElementById("create").addEventListener("click", (event) => {
  event.preventDefault();
  fetch(`/games/create`, { method: "post" })
    .then((response) => response.json())
    .then(({ game_id }) => {
      window.location.assign(`/games/${game_id}`);
    })
    .catch(console.log);
});

window.addEventListener("load", (event) => {
  event.preventDefault();
  console.log(`Lobby load event`);
  fetch(`/lobby/list-all-games`, { method: "post" })
    .then((response) => response.json())
    .then(({ game }) => {
      window.location.assign(`/lobby/${game}`);
    })
    .catch(console.log);
});

document.getElementById("all-games").addEventListener("click", (event) => {
  event.preventDefault();
  let allGamesLi = document.getElementById("all-games");
  let userGamesLi = document.getElementById("user-games");
  allGamesLi.classList.toggle("uk-active", true);
  userGamesLi.classList.toggle("uk-active", false);

  fetch(`/lobby/list-all-games`, { method: "post" })
    .then((response) => response.json())
    .then(({ game }) => {
      window.location.assign(`/lobby/${game}`);
    })
    .catch(console.log);
});

document.getElementById("user-games").addEventListener("click", (event) => {
  event.preventDefault();
  let allGamesLi = document.getElementById("all-games");
  let userGamesLi = document.getElementById("user-games");
  allGamesLi.classList.toggle("uk-active", false);
  userGamesLi.classList.toggle("uk-active", true);

  fetch(`/lobby/list-user-games`, { method: "post" })
    .then((response) => response.json())
    .then(({ game }) => {
      window.location.assign(`/lobby/${game}`);
    })
    .catch(console.log);
});
