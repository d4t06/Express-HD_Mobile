"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config"));
const env = process.env.NODE_ENV || "development";
const configByEnv = config_1.default[env];
const sequelize = new sequelize_1.Sequelize(configByEnv.database, configByEnv.username, configByEnv.password, configByEnv);
exports.default = sequelize;
