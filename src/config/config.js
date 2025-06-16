"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `../.env.local`, override: true });
const config = {
    development: {
        username: "root",
        password: "",
        database: "hd-mobile",
        host: "localhost",
        port: 3306,
        dialect: "mysql",
        dialectModule: require("mysql2"),
        logging: false,
    },
    production: {
        username: process.env.DB_USER || "",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "",
        host: process.env.DB_HOST || "",
        port: process.env.DB_PORT || "",
        dialect: "mysql",
        dialectModule: require("mysql2"),
        logging: false,
    },
};
exports.default = config;
