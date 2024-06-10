import {
   CreationOptional,
   DataTypes,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
   declare id: CreationOptional<number>;
   declare username: string;
   declare password: string;
   declare role: string;
}

User.init(
   {
      id: {
         primaryKey: true,
         autoIncrement: true,
         type: DataTypes.INTEGER,
      },
      username: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      password: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      role: {
         allowNull: false,
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Users",
   }
);

export default User;
