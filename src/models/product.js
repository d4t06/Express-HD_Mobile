"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const _1 = require(".");
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    name_ascii: {
        unique: true,
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    category_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    brand_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Products",
});
Product.hasMany(_1.Color, {
    foreignKey: "product_id",
    as: "colors",
});
Product.hasMany(_1.Variant, {
    foreignKey: "product_id",
    as: "variants",
});
Product.hasMany(_1.ProductAttribute, {
    foreignKey: "product_id",
    as: "attributes",
});
Product.hasMany(_1.Combine, {
    foreignKey: "product_id",
    as: "combines",
});
Product.hasOne(_1.Description, {
    foreignKey: "product_id",
    as: "description",
});
Product.hasOne(_1.DefaultProductVariant, {
    foreignKey: "product_id",
    as: "default_variant",
});
Product.hasOne(_1.ProductRating, {
    foreignKey: "product_id",
    as: "ratings",
});
Product.hasMany(_1.ProductSlider, {
    as: "product_sliders",
    foreignKey: "product_id",
});
// ProductSlider.belongsTo(Product);
_1.CartItem.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
});
exports.default = Product;
