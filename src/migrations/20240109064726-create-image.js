"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Images", {
         id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         image_url: {
            allowNull: false,
            type: Sequelize.STRING,
         },
         public_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
         },
         name: {
            allowNull: false,
            type: Sequelize.STRING,
         },
         size: {
            allowNull: false,
            type: Sequelize.INTEGER,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Images");
   },
};
