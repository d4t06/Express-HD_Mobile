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
   declare username_name: string;
   declare content: string;
   declare rating: number;
   declare approve: number;
   declare date_convert: string;
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
      username_name: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      content: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      approve: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      date_convert: {
         type: DataTypes.STRING,
      },
      rating: {
         type: DataTypes.INTEGER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Ratings",
   }
);

export default Rating;
