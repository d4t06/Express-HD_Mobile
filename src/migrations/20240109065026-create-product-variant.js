"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable(
         "Product_Variants",
         {
            id: {
               autoIncrement: true,
               primaryKey: true,
               type: Sequelize.INTEGER,
            },
            product_id: {
               allowNull: false,
               type: Sequelize.INTEGER,
               onDelete: "CASCADE",
               references: {
                  model: "Products",
                  key: "id",
               },
            },
            name_ascii: {
               allowNull: false,
               type: Sequelize.STRING,
            },
            name: {
               allowNull: false,
               type: Sequelize.STRING,
            },
         },
         {
            uniqueKeys: {
               check_unique: {
                  fields: ["product_id", "name_ascii"],
               },
            },
         }
      );
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Product_Variants");
   },
};
