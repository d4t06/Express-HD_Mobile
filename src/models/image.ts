import {
   CreationOptional,
   DataTypes,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";
import SliderImage from "./sliderImage";

class Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
   declare id: CreationOptional<number>;
   declare image_url: string;
   declare public_id: string;
   declare name: string;
   declare size: number;
}

Image.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      name: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      image_url: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      public_id: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      size: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Images",
   }
);

SliderImage.belongsTo(Image, {
   foreignKey: "image_id",
   as: "image",
});

export default Image;
