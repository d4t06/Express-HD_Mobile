import {
   CreationOptional,
   DataTypes,
   InferAttributes,
   InferCreationAttributes,
   Model,
   NonAttribute,
} from "sequelize";

import CategorySlider from "./categorySlider";
import sequelize from "../config/sequelize";
import SliderImage from "./sliderImage";
import ProductSlider from "./productSlider";

class Slider extends Model<InferAttributes<Slider>, InferCreationAttributes<Slider>> {
   declare id: CreationOptional<number>;
   declare name: string;
   declare slider_images: NonAttribute<SliderImage[]>;
}

Slider.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      name: {
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
   }
);

CategorySlider.belongsTo(Slider, {
   onDelete: "CASCADE",
   foreignKey: "slider_id",
   as: "slider",
});

ProductSlider.belongsTo(Slider, {
   onDelete: "CASCADE",
   foreignKey: "slider_id",
   as: "slider",
});

Slider.hasMany(SliderImage, {
   onDelete: "CASCADE",
   foreignKey: "slider_id",
   as: "slider_images",
});

export default Slider;
