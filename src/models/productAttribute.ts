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
   declare product_id: number;
   declare value: string;
}

ProductAttribute.init(
   {
      id: {
         type: DataTypes.NUMBER,
         primaryKey: true,
         autoIncrement: true,
      },
      category_attribute_id: {
         allowNull: false,
         type: DataTypes.NUMBER,
      },
      product_id: {
         allowNull: false,
         type: DataTypes.NUMBER,
      },
      value: {
         allowNull: false,
         type: DataTypes.TEXT,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Attributes",
   },
);

export default ProductAttribute;
