/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
const socket = io();

const GAME_ID = parseInt(document.getElementById("game-id").innerText);

window.addEventListener("load",(event) => {
  updateGameState(GAME_ID);
});

const orderOpponentHands = (hands, userOrder) => {
  const maxOrder = Math.max.apply(Math, array.map((o) => { return o.order }));

  if(userOrder == 1 || userOrder > maxOrder) {

  }
}

const updateGameState = (gameId) => {
  fetch(`/games/game-state/game/${gameId}`, { method: "post" })
    .then(async (response) => {
      return await response.json();
    }).then(async (result) => {
      // console.log("GAME_ID",GAME_ID)
      // console.log("gameId", gameId)
      if(gameId != GAME_ID){
        // console.log("WRONG GAME")
        return;
      }
      let playerHandDiv = document.getElementById("hand");
      let opponentHandsDiv = document.getElementById("opponent-hands");
      let decksDiv = document.getElementById("decks");
      playerHandDiv.classList.toggle("is-turn",false);
      const opHands = result.opponentStatus;
      // sort opponenthands
      // opHands.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
      console.log(opHands)



      if(result.isCurrentPlayerTurn) {
        playerHandDiv.classList.add('is-turn');
      }
      while (playerHandDiv.lastElementChild) {
        playerHandDiv.removeChild(playerHandDiv.lastElementChild);
      }
      while (opponentHandsDiv.lastElementChild) {
        opponentHandsDiv.removeChild(opponentHandsDiv.lastElementChild);
      }
      while (decksDiv.lastElementChild) {
        decksDiv.removeChild(decksDiv.lastElementChild);
      }
      for (var card of result.hand) {
        playerHandDiv.appendChild(createCard(card));
      }
      for(var deck of opHands) {
        const opponentDeck = opponentHandsDiv.appendChild(createCard({ id: -1, color: 'back', displayname: deck.displayname}))
        if(deck.currentPlayer) {
          opponentDeck.classList.add('is-turn');
        }
      }
      decksDiv.appendChild(createCard(result.discard));
      decksDiv.appendChild(createCard({id: 0, color: 'back', displayname: 'notuno'}))

      // console.log(result)
    })
}

// * allowed: boolean
socket.on("CARD_PLAYED", ( {gameId, allowed} ) => {
  console.log("in CARD PLAYED", gameId);
  updateGameState(gameId);
});

// * cardDrawn: boolean
socket.on("CARD_DRAWN", ({allowed, gameId}) => {
  console.log("in CARD DRAWN", gameId);
  updateGameState(gameId);
});

socket.on("GAME_STATE", ({ gameId }) => {
  console.log("in Game state", gameId);
  updateGameState(gameId);
});

window.onload = (event) => {
  event.preventDefault();
  updateGameState();
};