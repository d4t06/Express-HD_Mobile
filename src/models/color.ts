import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";
import Combine from "./combine";
import ProductSlider from "./productSlider";

class Color extends Model<InferAttributes<Color>, InferCreationAttributes<Color>> {
   declare id: CreationOptional<number>;
   declare product_ascii: ForeignKey<string>;
   declare color: string;
   declare color_ascii: string;
}

Color.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      product_ascii: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      color: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      color_ascii: {
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

// ProductSlider.belongsTo(Color, {
//    foreignKey: "color_id",
// });

export default Color;
