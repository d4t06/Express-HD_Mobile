"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    username: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
    role: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: sequelize_2.default,
    timestamps: false,
    tableName: "Users",
});
exports.default = User;
