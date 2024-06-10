import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
   NonAttribute,
} from "sequelize";

import sequelize from "../config/sequelize";
import Slider from "./slider";

class CategorySlider extends Model<
   InferAttributes<CategorySlider>,
   InferCreationAttributes<CategorySlider>
> {
   declare id: CreationOptional<number>;
   declare slider_id: number;
   declare category_id: ForeignKey<number>;
   declare slider: NonAttribute<Slider>;
}

CategorySlider.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      category_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      slider_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Category_Sliders",
   }
);

export default CategorySlider;
