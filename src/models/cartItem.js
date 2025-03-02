"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class CartItem extends sequelize_1.Model {
}
CartItem.init({
    id: {
        type: sequelize_1.DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
    color_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    variant_id: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    amount: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Cart_Items",
});
exports.default = CartItem;
