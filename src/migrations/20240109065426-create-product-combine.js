"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable(
         "Product_Combines",
         {
            id: {
               autoIncrement: true,
               primaryKey: true,
               type: Sequelize.INTEGER,
            },
            product_id: {
               onDelete: "CASCADE",
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: "Products",
                  key: "id",
               },
            },
            color_id: {
               onDelete: "CASCADE",
               allowNull: false,
               type: Sequelize.INTEGER,
               references: {
                  model: "Product_Colors",
                  key: "id",
               },
            },
            variant_id: {
               onDelete: "CASCADE",
               allowNull: false,
               type: Sequelize.INTEGER,
               references: {
                  model: "Product_Variants",
                  key: "id",
               },
            },
            price: {
               allowNull: false,
               type: Sequelize.INTEGER,
            },
            quantity: {
               allowNull: false,
               type: Sequelize.INTEGER,
            },
         },
         {
            uniqueKeys: {
               check_unique: {
                  fields: ["product_id", "variant_id", "color_id"],
               },
            },
         }
      );
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Product_Combines");
   },
};
