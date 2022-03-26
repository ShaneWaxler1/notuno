"use strict";

const tables = require("../db/table_names");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tables.GAME_CARDS, {
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      discarded: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      draw_pile: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      id_of_wild: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    });
    // queryInterface.addConstraint(tables.GAME_CARDS, {
    //   fields: ['user_id'],
    //   type: 'foreign key',
    //   references: {
    //     table: tables.USERS,
    //     field: 'id',
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade'
    // });
    // queryInterface.addConstraint(tables.GAME_CARDS, {
    //   fields: ['card_id'],
    //   type: 'foreign key',
    //   references: {
    //     table: tables.CARDS,
    //     field: 'id',
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade'
    // });
    // queryInterface.addConstraint(tables.GAME_CARDS, {
    //   fields: ['game_id'],
    //   type: 'foreign key',
    //   references: {
    //     table: tables.GAMES,
    //     field: 'id',
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade'
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropConstraint(tables.GAME_CARDS, )
    // await queryInterface.dropTable(tables.GAME_CARDS, {onDelete: 'cascade'});
    await queryInterface.sequelize.query(
      "DROP TABLE IF EXISTS game_cards CASCADE;"
    );
  },
};
