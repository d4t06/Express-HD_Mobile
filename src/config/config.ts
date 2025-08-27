import dotenv from "dotenv";

dotenv.config({ path: `../.env.local`, override: true });

const config = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "hd-mobile",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: false,
};

export default config;
