const createCard = (card) => {
  let cardDiv = document.createElement("div");
  cardDiv.value = card.id;
  cardDiv.className = "card";
  cardDiv.innerText = card.displayname;
  cardDiv.id = card.color + "-card";
  
  cardDiv.addEventListener("click", cardClick);
  return cardDiv;
}

const cardClick = (event) => {
  let cardId = event.srcElement.value;
  console.log("cardId", cardId)
  // ADD CHECK FOR OPPONENT CARDS
  if (cardId > 100) {
    // pass
    // enableColorPicker(GAME_ID, cardId);
  } 
  let json = fetch(
    `/games/playMove/game/${GAME_ID}/move/${cardId}/`,
    { method: "POST" }
  ).then((response) => response.json());

}

// socket.on("GAME_STATE", ({ gameId }) => {
//   // console.log("in Game state with game id", gameId);
//   updateGameState(gameId);
//   // PlayerActions.getGameState();
// });

function enableColorPicker(game_id, playerMove) {
  let redColorPickerButton = document.getElementById("redColorPickerButton");
  let blueColorPickerButton = document.getElementById("blueColorPickerButton");
  let greenColorPickerButton = document.getElementById(
    "greenColorPickerButton"
  );
  let yellowColorPickerButton = document.getElementById(
    "yellowColorPickerButton"
  );
  let colorPicker = document.getElementById("ColorPicker");
  colorPicker.style.visibility = "visible";
  redColorPickerButton.value = `/games/playMove/game/${game_id}/move/${
    playerMove.value + ",red"
  }/`;
  blueColorPickerButton.value = `/games/playMove/game/${game_id}/move/${
    playerMove.value + ",blue"
  }/`;
  greenColorPickerButton.value = `/games/playMove/game/${game_id}/move/${
    playerMove.value + ",green"
  }/`;
  yellowColorPickerButton.value = `/games/playMove/game/${game_id}/move/${
    playerMove.value + ",yellow"
  }/`;
}
