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
    await queryInterface.createTable(tables.USERS, {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwd: { type: Sequelize.STRING, allowNull: false },
      displayname: { type: Sequelize.STRING, allowNull: false, unique: true },
    });
    // queryInterface.addConstraint(tables.USERS, {
    //   type: "primary key",
    //   fields: ["id"],
    // });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.dropTable(tables.USERS, {onDelete: 'cascade'});
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS users CASCADE;");
  },
};
