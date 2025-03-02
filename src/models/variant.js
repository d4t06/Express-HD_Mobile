"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const combine_1 = __importDefault(require("./combine"));
const defaultVariantCombine_1 = __importDefault(require("./defaultVariantCombine"));
const defaultProductVariant_1 = __importDefault(require("./defaultProductVariant"));
class Variant extends sequelize_1.Model {
}
Variant.init({
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
    tableName: "Product_Variants",
});
combine_1.default.belongsTo(Variant, {
    onDelete: "CASCADE",
    foreignKey: "variant_id",
});
// Variant.hasOne(DefaultVariantCombine, {
//    foreignKey: "variant_id",
//    as: "default_combine",
// });
// DefaultVariantCombine.belongsTo(Variant, {
//    onDelete: "CASCADE",
//    foreignKey: "variant_id",
//    as: "default_combine",
// });
defaultProductVariant_1.default.belongsTo(Variant, {
    foreignKey: "variant_id",
    as: "variant",
});
Variant.hasOne(defaultVariantCombine_1.default, {
    foreignKey: "variant_id",
    as: "default_combine",
});
exports.default = Variant;
