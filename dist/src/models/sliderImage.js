"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class SliderImage extends sequelize_1.Model {
}
SliderImage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    slider_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    image_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    link_to: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Slider_Images",
});
exports.default = SliderImage;
