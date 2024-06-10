import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";
import ProductAttribute from "./productAttribute";

class CategoryAttribute extends Model<
   InferAttributes<CategoryAttribute>,
   InferCreationAttributes<CategoryAttribute>
> {
   declare id: CreationOptional<number>;
   declare category_id: ForeignKey<number>;
   declare attribute: string;
   declare attribute_ascii: number;
}

CategoryAttribute.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      // need to specific 'category_id' cause put belongTo in Category model file
      category_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      attribute: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      attribute_ascii: {
         allowNull: false,
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Category_Attributes",
   }
);

ProductAttribute.belongsTo(CategoryAttribute, {
   onDelete: "CASCADE",
   foreignKey: "category_attribute_id",
});

export default CategoryAttribute;
