"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class ProductAttribute extends sequelize_1.Model {
}
ProductAttribute.init({
    id: {
        type: sequelize_1.DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_attribute_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.NUMBER,
    },
    product_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.NUMBER,
    },
    value: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Product_Attributes",
});
exports.default = ProductAttribute;
