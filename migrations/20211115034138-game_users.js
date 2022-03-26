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
        // UNCOMMENT THIS ONCE DB DESIGN WORKS!!!!!
        // unique: true,
      },
      order: {
        type: Sequelize.INTEGER,
      },
      // MAYBE KEEP current_player, MAYBE NOT...
      current_player: { type: Sequelize.BOOLEAN, defaultValue: false },
    });

    // queryInterface.addConstraint(tables.GAME_USERS,{
    //   fields: ['game_id'],
    //   type: 'foreign key',
    //   references: {
    //     table: tables.GAMES,
    //     field: 'id'
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade'
    // }),
    // queryInterface.addConstraint(tables.GAME_USERS,{
    //   fields: ['user_id'],
    //   type: 'foreign key',
    //   references: {
    //     table: tables.USERS,
    //     field: 'id'
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade'
    // })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DROP TABLE IF EXISTS game_users CASCADE;"
    );
  },
};
