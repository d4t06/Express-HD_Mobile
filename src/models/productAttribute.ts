import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class ProductAttribute extends Model<
   InferAttributes<ProductAttribute>,
   InferCreationAttributes<ProductAttribute>
> {
   declare id: CreationOptional<number>;
   declare category_attribute_id: ForeignKey<number>;
   declare value: string;
}

ProductAttribute.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      category_attribute_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      value: {
         allowNull: false,
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Attributes",
   }
);

export default ProductAttribute;
