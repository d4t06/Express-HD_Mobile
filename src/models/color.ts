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
import Combine from "./combine";
import ProductSlider from "./productSlider";

class Color extends Model<InferAttributes<Color>, InferCreationAttributes<Color>> {
   declare id: CreationOptional<number>;
   declare product_id: ForeignKey<number>;
   declare name: string;
   declare name_ascii: string;
   declare product_slider: NonAttribute<ProductSlider>;
}

Color.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      product_id: {
         allowNull: false,
         type: DataTypes.NUMBER,
      },
      name: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      name_ascii: {
         allowNull: false,
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Colors",
   }
);

Combine.belongsTo(Color, {
   foreignKey: "color_id",
});

Color.hasOne(ProductSlider, {
   foreignKey: "color_id",
   as: "product_slider",
});

export default Color;
