"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const defaultVariantCombine_1 = __importDefault(require("./defaultVariantCombine"));
class Combine extends sequelize_1.Model {
}
Combine.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_ascii: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    color_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    variant_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    price: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    quantity: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Product_Combines",
});
defaultVariantCombine_1.default.belongsTo(Combine, {
    foreignKey: "combine_id",
    as: "combine",
});
exports.default = Combine;
