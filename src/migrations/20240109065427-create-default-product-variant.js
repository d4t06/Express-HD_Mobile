"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Default_Product_Variants", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         product_id: {
            onDelete: "CASCADE",
            allowNull: false,
            type: Sequelize.INTEGER,
            unique: true,
            references: {
               model: "Products",
               key: "id",
            },
         },
         variant_id: {
            onDelete: "SET NULL",
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
               model: "Product_Variants",
               key: "id",
            },
         },
      });
   },
   async down(queryInterface, _Sequelize) {
      await queryInterface.dropTable("Default_Product_Variants");
   },
};
