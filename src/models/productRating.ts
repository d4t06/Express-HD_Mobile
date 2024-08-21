import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class Rating extends Model<InferAttributes<Rating>, InferCreationAttributes<Rating>> {
   declare id: CreationOptional<number>;
   declare product_id: ForeignKey<number>;
   declare username: string;
   declare content: string;
   declare rate: number;
   declare approve: number;
   declare date_convert: string;
   declare total_like: number;
   declare createdAt: CreationOptional<Date>;
}

Rating.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      product_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      username: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      content: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      approve: {
         defaultValue: 0,
         type: DataTypes.INTEGER,
      },
      date_convert: {
         type: DataTypes.STRING,
      },
      rate: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      total_like: {
         defaultValue: 0,
         type: DataTypes.INTEGER,
      },
      createdAt: DataTypes.DATE,
   },
   {
      sequelize,
      timestamps: true,
      updatedAt: false,
      tableName: "Product_Ratings",
   }
);

export default Rating;
