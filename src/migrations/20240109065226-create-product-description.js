"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Product_Descriptions", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         product_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false,
            onDelete: "CASCADE",
            references: {
               model: "Products",
               key: "id",
            },
         },
         content: {
            type: Sequelize.TEXT,
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Product_Descriptions");
   },
};
