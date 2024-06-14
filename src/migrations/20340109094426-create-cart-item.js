"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Cart_Items", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         product_ascii: {
            onDelete: "CASCADE",
            type: Sequelize.STRING,
            allowNull: false,
            references: {
               model: "Products",
               key: "product_ascii",
            },
         },
         color_id: {
            onDelete: "CASCADE",
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "Product_Colors",
               key: "id",
            },
         },
         variant_id: {
            onDelete: "CASCADE",
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "Product_Variants",
               key: "id",
            },
         },
         amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         username: {
            type: Sequelize.STRING,
            allowNull: false,
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Cart_Items");
   },
};
