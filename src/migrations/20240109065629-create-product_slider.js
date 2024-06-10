"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Product_Sliders", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         slider_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
         },
         color_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
         },
         product_ascii: {
            allowNull: false,
            type: Sequelize.STRING,
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Product_Sliders");
   },
};
