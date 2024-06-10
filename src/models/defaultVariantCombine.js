"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class DefaultVariantCombine extends sequelize_1.Model {
}
DefaultVariantCombine.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    combine_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    variant_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Default_Variant_Combines",
});
exports.default = DefaultVariantCombine;
