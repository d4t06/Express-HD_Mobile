import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class SliderImage extends Model<
   InferAttributes<SliderImage>,
   InferCreationAttributes<SliderImage>
> {
   declare id: CreationOptional<number>;
   declare slider_id: ForeignKey<number>;
   declare image_id: ForeignKey<number>;
   declare link_to: string;
}

SliderImage.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      slider_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      image_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      link_to: {
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Slider_Images",
   }
);

export default SliderImage;
