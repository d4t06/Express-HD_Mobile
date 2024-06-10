import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";
import DefaultVariantCombine from "./defaultVariantCombine";

class Combine extends Model<InferAttributes<Combine>, InferCreationAttributes<Combine>> {
   declare id: CreationOptional<number>;
   declare product_ascii: ForeignKey<string>;
   declare color_id: ForeignKey<number>;
   declare variant_id: ForeignKey<number>;
   declare price: number;
   declare quantity: number;
}

Combine.init(
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
      color_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      variant_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      price: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      quantity: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Combines",
   }
);

DefaultVariantCombine.belongsTo(Combine, {
   foreignKey: "combine_id",
   as: "combine",
});

export default Combine;
