"use strict";
const tables = require("../db/table_names");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    queryInterface.createTable(tables.GAMES, {
      id: { type: Sequelize.INTEGER, autoIncrement: true },
      direction: { type: Sequelize.INTEGER },
      winner: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null },
      started: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
    // queryInterface.addConstraint(tables.GAMES,
    //   {
    //     type: 'primary key',
    //     fields: ['id']
    // });
    // queryInterface.addConstraint(tables.GAMES, {
    //   fields: ['winner'],
    //   type: 'foreign key',
    //   references: {
    //     table: tables.GAME_USERS,
    //     field: 'user_id'
    //   },
    //   onDelete: 'cascade',
    //   onUpdate: 'cascade'
    // })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    //queryInterface.dropTable(tables.GAMES, {onDelete: 'cascade', force});
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS games CASCADE;");
  },
};
