"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Products", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         name: {
            allowNull: true,
            type: Sequelize.STRING,
         },
         name_ascii: {
            allowNull: true,
            unique: true,
            type: Sequelize.STRING,
         },
         brand_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            onDelete: "SET NULL",
            references: { model: "Brands", key: "id" },
         },
         category_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            onDelete: "SET NULL",
            references: { model: "Categories", key: "id" },
         },
         image_url: {
            type: Sequelize.STRING,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Products");
   },
};
