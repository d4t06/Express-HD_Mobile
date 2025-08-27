import { Options, Sequelize } from "sequelize";

import config from "./config";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config as Options,
);

export default sequelize;
