import { Options, Sequelize } from "sequelize";

import config from "./config";
const env: keyof typeof config =
  (process.env.NODE_ENV as keyof typeof config) || "development";

const configByEnv = config[env];

const sequelize = new Sequelize(
  configByEnv.database,
  configByEnv.username,
  configByEnv.password,
  configByEnv as Options,
);

export default sequelize;
