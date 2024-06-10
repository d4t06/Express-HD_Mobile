"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const brand_1 = __importDefault(require("./brand"));
const categoryAttribute_1 = __importDefault(require("./categoryAttribute"));
const priceRange_1 = __importDefault(require("./priceRange"));
const categorySlider_1 = __importDefault(require("./categorySlider"));
const product_1 = __importDefault(require("./product"));
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
    },
    category_ascii: {
        type: sequelize_1.DataTypes.STRING,
    },
    attribute_order: {
        type: sequelize_1.DataTypes.STRING,
    },
    hidden: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
});
Category.hasMany(categoryAttribute_1.default, {
    as: "attributes",
    foreignKey: "category_id",
});
Category.hasMany(brand_1.default, {
    foreignKey: "category_id",
    as: "brands",
});
Category.hasMany(priceRange_1.default, {
    foreignKey: "category_id",
    as: "price_ranges",
});
Category.hasOne(categorySlider_1.default, {
    foreignKey: "category_id",
    as: "category_slider",
});
product_1.default.belongsTo(Category, {
    foreignKey: "category_id",
    as: 'category'
});
exports.default = Category;
