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

class ProductSlider extends Model<
   InferAttributes<ProductSlider>,
   InferCreationAttributes<ProductSlider>
> {
   declare id: CreationOptional<number>;
   declare slider_id: number;
   declare product_ascii: ForeignKey<string>;
   declare color_id: ForeignKey<number>;
   declare slider: NonAttribute<Slider>;
}

ProductSlider.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      color_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      product_ascii: {
         type: DataTypes.STRING,
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
      tableName: "Product_Sliders",
   }
);




export default ProductSlider;
