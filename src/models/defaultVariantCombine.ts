import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class DefaultVariantCombine extends Model<
   InferAttributes<DefaultVariantCombine>,
   InferCreationAttributes<DefaultVariantCombine>
> {
   declare id: CreationOptional<number>;
   declare variant_id: ForeignKey<number>;
   declare combine_id: CreationOptional<number>;
}

DefaultVariantCombine.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      combine_id: {
         type: DataTypes.INTEGER,
      },
      variant_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Default_Variant_Combines",
   }
);

export default DefaultVariantCombine;
