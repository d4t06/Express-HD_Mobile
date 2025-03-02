"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class Rating extends sequelize_1.Model {
}
Rating.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    username: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    content: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    approve: {
        defaultValue: 0,
        type: sequelize_1.DataTypes.INTEGER,
    },
    date_convert: {
        type: sequelize_1.DataTypes.STRING,
    },
    rate: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    total_like: {
        defaultValue: 0,
        type: sequelize_1.DataTypes.INTEGER,
    },
    createdAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: sequelize_2.default,
    timestamps: true,
    updatedAt: false,
    tableName: "Product_Ratings",
});
exports.default = Rating;
