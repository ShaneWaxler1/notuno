"use strict";
const { QueryTypes } = require("sequelize");
const tables = require("../db/table_names");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("game_users", {
      game_id: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
      },
      current_player: { type: Sequelize.BOOLEAN, defaultValue: false },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DROP TABLE IF EXISTS game_users CASCADE;"
    );
  },
};