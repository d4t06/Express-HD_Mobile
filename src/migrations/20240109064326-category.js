"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Categories", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         name_ascii: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         name: {
            allowNull: false,
            type: Sequelize.STRING,
         },
         attribute_order: {
            allowNull: false,
            type: Sequelize.STRING,
         },
         hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
      });
   },

   async down(queryInterface, _Sequelize) {
      await queryInterface.dropTable("Categories");
   },
};
