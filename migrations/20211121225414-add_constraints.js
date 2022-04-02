"use strict";
const tables = require("../db/table_names");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint(tables.GAMES, {
      type: "primary key",
      fields: ["id"],
    });
    queryInterface.addConstraint(tables.GAME_USERS, {
      fields: ["game_id"],
      type: "foreign key",
      references: {
        table: tables.GAMES,
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
      queryInterface.addConstraint(tables.GAME_USERS, {
        fields: ["user_id"],
        type: "foreign key",
        references: {
          table: tables.USERS,
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      });
    queryInterface.addConstraint(tables.GAME_CARDS, {
      fields: ["user_id"],
      type: "foreign key",
      references: {
        table: tables.USERS,
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    queryInterface.addConstraint(tables.GAME_CARDS, {
      fields: ["card_id"],
      type: "foreign key",
      references: {
        table: tables.CARDS,
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    queryInterface.addConstraint(tables.GAME_CARDS, {
      fields: ["game_id"],
      type: "foreign key",
      references: {
        table: tables.GAMES,
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    queryInterface.sequelize.query(
      "INSERT INTO users (email, passwd, \"displayname\") VALUES ('test@test', 'test', 'test');"
    );
  },

  down: async (queryInterface, Sequelize) => {
    
  },
};
