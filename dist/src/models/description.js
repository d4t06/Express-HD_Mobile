"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class Description extends sequelize_1.Model {
}
Description.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_ascii: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Product_Descriptions",
});
exports.default = Description;
