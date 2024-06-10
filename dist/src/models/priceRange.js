"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class PriceRange extends sequelize_1.Model {
}
PriceRange.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    label: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    from: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    to: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: 'Price_Ranges'
});
exports.default = PriceRange;
