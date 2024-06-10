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
import DefaultVariantCombine from "./defaultVariantCombine";
import DefaultProductVariant from "./defaultProductVariant";

class Variant extends Model<InferAttributes<Variant>, InferCreationAttributes<Variant>> {
   declare id: CreationOptional<number>;
   declare product_ascii: ForeignKey<string>;
   declare variant: string;
   declare variant_ascii: string;
   declare default_combine: NonAttribute<DefaultVariantCombine>;
}

Variant.init(
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
      variant: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      variant_ascii: {
         allowNull: false,
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Variants",
   }
);

Combine.belongsTo(Variant, {
   onDelete: "CASCADE",
   foreignKey: "variant_id",
});

// Variant.hasOne(DefaultVariantCombine, {
//    foreignKey: "variant_id",
//    as: "default_combine",
// });

// DefaultVariantCombine.belongsTo(Variant, {
//    onDelete: "CASCADE",
//    foreignKey: "variant_id",
//    as: "default_combine",
// });

DefaultProductVariant.belongsTo(Variant, {
   foreignKey: "variant_id",
   as: "variant",
});

Variant.hasOne(DefaultVariantCombine, {
   foreignKey: "variant_id",
   as: "default_combine",
});

export default Variant;
