"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class DefaultProductVariant extends sequelize_1.Model {
}
DefaultProductVariant.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.NUMBER,
    },
    variant_id: {
        defaultValue: null,
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Default_Product_Variants",
});
exports.default = DefaultProductVariant;
