"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const categorySlider_1 = __importDefault(require("./categorySlider"));
const sequelize_2 = __importDefault(require("../config/sequelize"));
const sliderImage_1 = __importDefault(require("./sliderImage"));
const productSlider_1 = __importDefault(require("./productSlider"));
class Slider extends sequelize_1.Model {
}
Slider.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
});
categorySlider_1.default.belongsTo(Slider, {
    onDelete: "CASCADE",
    foreignKey: "slider_id",
    as: "slider",
});
productSlider_1.default.belongsTo(Slider, {
    onDelete: "CASCADE",
    foreignKey: "slider_id",
    as: "slider",
});
Slider.hasMany(sliderImage_1.default, {
    onDelete: "CASCADE",
    foreignKey: "slider_id",
    as: "slider_images",
});
exports.default = Slider;
