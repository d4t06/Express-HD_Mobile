"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const productAttribute_1 = __importDefault(require("./productAttribute"));
class CategoryAttribute extends sequelize_1.Model {
}
CategoryAttribute.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // need to specific 'category_id' cause put belongTo in Category model file
    category_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    attribute: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    attribute_ascii: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Category_Attributes",
});
productAttribute_1.default.belongsTo(CategoryAttribute, {
    onDelete: "CASCADE",
    foreignKey: "category_attribute_id",
});
exports.default = CategoryAttribute;
