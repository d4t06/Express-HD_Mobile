"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const sliderImage_1 = __importDefault(require("./sliderImage"));
class Image extends sequelize_1.Model {
}
Image.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    image_url: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    public_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    size: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Images",
});
sliderImage_1.default.belongsTo(Image, {
    foreignKey: "image_id",
    as: "image",
});
exports.default = Image;
