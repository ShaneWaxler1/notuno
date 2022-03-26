"use strict";
const tables = require("../db/table_names");

const CARD_LIST = (() => {
  const colors = ["red", "yellow", "blue", "green"];
  const number_cards = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const action_cards = ["Draw 2", "Reverse", "Skip"];
  const wild_cards = ["Wild", "Draw 4"];

  const deck = [];

  colors.forEach((color) => {
    // One zero for each color
    deck.push({ color, displayname: "0" });
    // console.log(`pushing after zero cards: ${deck} with color ${color}`);

    // Two of each number card (other than 0)
    const nums = number_cards.map((displayname) => ({ color, displayname }));
    deck.push(...nums, ...nums);
    // console.log(`pushing after number cards: ${deck} with color ${color}`);
    // Two of each action card
    const actions = action_cards.map((displayname) => ({ color, displayname }));
    deck.push(...actions, ...actions);
    // console.log(`pushing after number action cards: ${deck} with color ${color}`);
  });

  // Four of each wild card
  const wilds = wild_cards.map((displayname) => ({
    color: "Wild",
    displayname,
  }));
  deck.push(...wilds, ...wilds, ...wilds, ...wilds);

  colors.forEach((color) => {
    deck.push({ color, displayname: "Wild" });
    deck.push({ color, displayname: "Draw 4" });
  });

  return deck;
})();

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tables.CARDS, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
      },
      color: { type: DataTypes.STRING, allowNull: false },
      displayname: { type: DataTypes.STRING, allowNull: false },
    });

    return queryInterface.bulkInsert(tables.CARDS, CARD_LIST);
  },

  down: async (queryInterface, DataTypes) => {
    // await queryInterface.dropTable(tables.CARDS, {onDelete: 'cascade'});
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS cards CASCADE;");
  },
};
