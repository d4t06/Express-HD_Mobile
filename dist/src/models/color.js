"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const combine_1 = __importDefault(require("./combine"));
const productSlider_1 = __importDefault(require("./productSlider"));
class Color extends sequelize_1.Model {
}
Color.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.NUMBER,
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    name_ascii: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Product_Colors",
});
combine_1.default.belongsTo(Color, {
    foreignKey: "color_id",
});
Color.hasOne(productSlider_1.default, {
    foreignKey: "color_id",
    as: "product_slider",
});
exports.default = Color;
