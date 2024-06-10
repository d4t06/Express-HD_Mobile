"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const color_1 = __importDefault(require("./color"));
const variant_1 = __importDefault(require("./variant"));
const productAttribute_1 = __importDefault(require("./productAttribute"));
const combine_1 = __importDefault(require("./combine"));
const description_1 = __importDefault(require("./description"));
const defaultProductVariant_1 = __importDefault(require("./defaultProductVariant"));
const productSlider_1 = __importDefault(require("./productSlider"));
class Product extends sequelize_1.Model {
}
Product.init({
    product_ascii: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    product: {
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
Product.hasMany(color_1.default, {
    foreignKey: "product_ascii",
    as: "colors",
});
Product.hasMany(variant_1.default, {
    foreignKey: "product_ascii",
    as: "variants",
});
Product.hasMany(productAttribute_1.default, {
    foreignKey: "product_ascii",
    as: "attributes",
});
Product.hasMany(combine_1.default, {
    foreignKey: "product_ascii",
    as: "combines",
});
Product.hasOne(description_1.default, {
    foreignKey: "product_ascii",
    as: "description",
});
Product.hasOne(defaultProductVariant_1.default, {
    foreignKey: "product_ascii",
    as: "default_variant",
});
productSlider_1.default.belongsTo(Product, {
    foreignKey: "product_ascii",
});
exports.default = Product;
