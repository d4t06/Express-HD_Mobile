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
            product_ascii: {
               type: Sequelize.STRING,
               allowNull: false,
               onDelete: "CASCADE",
               onUpdate: "CASCADE",
               references: {
                  model: "Products",
                  key: "product_ascii",
               },
            },
            variant_ascii: {
               type: Sequelize.STRING,
               allowNull: false,
            },
            variant: {
               allowNull: false,
               type: Sequelize.STRING,
            },
         },
         {
            uniqueKeys: {
               check_unique: {
                  fields: ["product_ascii", "variant_ascii"],
               },
            },
         }
      );
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Product_Variants");
   },
};
