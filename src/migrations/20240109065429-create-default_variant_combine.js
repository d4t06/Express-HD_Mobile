"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Default_Variant_Combines", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         combine_id: {
            onDelete: "SET NULL",
            type: Sequelize.INTEGER,
            unique: true,
            references: {
               model: "Product_Combines",
               key: "id",
            },
         },
         variant_id: {
            unique: true,
            onDelete: "CASCADE",
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
               model: "Product_Variants",
               key: "id",
            },
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Default_Variant_Combines");
   },
};
