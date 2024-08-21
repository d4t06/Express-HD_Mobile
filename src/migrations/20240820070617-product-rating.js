"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Product_Ratings", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         product_id: {
            onDelete: "CASCADE",
            type: Sequelize.INTEGER,
            references: {
               key: "id",
               model: "Products",
            },
         },
         username: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         content: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         rate: {
            type: Sequelize.INTEGER,
            validate: {
               isIn: [[1, 2, 3, 4, 5]],
            },
            allowNull: false,
         },
         approve: {
            type: Sequelize.INTEGER,
            validate: {
               isIn: [[0, 1]],
            },
            defaultValue: 0,
         },
         date_convert: {
            type: Sequelize.STRING,
         },
         total_like: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
      });
   },

   async down(queryInterface, Sequelize) {},
};
