"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable(
         "Product_Attributes",
         {
            id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            category_attribute_id: {
               onDelete: "CASCADE",
               onUpdate: "CASCADE",
               type: Sequelize.INTEGER,
               references: {
                  model: "Category_Attributes",
                  key: "id",
               },
            },
            product_id: {
               onDelete: "CASCADE",
               onUpdate: "CASCADE",
               type: Sequelize.INTEGER,
               references: {
                  model: "Products",
                  key: "id",
               },
            },
            value: {
               allowNull: false,
               type: Sequelize.TEXT,
            },
         },
         {
            uniqueKeys: {
               Product_Attributes_unique: {
                  fields: ["category_attribute_id", "product_id"],
               },
            },
         }
      );
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Product_Attributes");
   },
};
