import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class DefaultProductVariant extends Model<
   InferAttributes<DefaultProductVariant>,
   InferCreationAttributes<DefaultProductVariant>
> {
   declare id: CreationOptional<number>;
   declare variant_id: CreationOptional<number>;
   declare product_ascii: ForeignKey<string>;
}

DefaultProductVariant.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      product_ascii: {
         allowNull: false,
         unique: true,
         type: DataTypes.STRING,
      },
      variant_id: {
         defaultValue: null,
         type: DataTypes.INTEGER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Default_Product_Variants",
   }
);

export default DefaultProductVariant;
