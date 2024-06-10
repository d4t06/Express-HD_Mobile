"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Price_Ranges", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         from: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         to: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         category_id: {
            onDelete: "CASCADE",
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "Categories",
               key: "id",
            },
         },
         label: {
            type: Sequelize.STRING,
         },
      });
   },
   async down(queryInterface, _Sequelize) {
      await queryInterface.dropTable("Price_Ranges");
   },
};
