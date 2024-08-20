import {
   Attributes,
   CreationOptional,
   DataTypes,
   ForeignKey,
   HasMany,
   InferAttributes,
   InferCreationAttributes,
   Model,
   NonAttribute,
} from "sequelize";

import sequelize from "../config/sequelize";
import Brand from "./brand";
import CategoryAttribute from "./categoryAttribute";
import PriceRange from "./priceRange";
import CategorySlider from "./categorySlider";
import Product from "./product";

class Category extends Model<
   InferAttributes<Category>,
   InferCreationAttributes<Category>
> {
   declare id: CreationOptional<number>;
   declare name: string;
   declare name_ascii: string;
   declare hidden: boolean;
   declare attribute_order: string;
   declare brands: NonAttribute<Brand[]>;
   declare attributes: NonAttribute<CategoryAttribute[]>;
   declare price_ranges: NonAttribute<PriceRange[]>;
   declare category_slider: NonAttribute<CategorySlider>;
}

Category.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      name: {
         type: DataTypes.STRING,
      },
      name_ascii: {
         type: DataTypes.STRING,
      },
      attribute_order: {
         type: DataTypes.STRING,
      },
      hidden: {
         type: DataTypes.BOOLEAN,
      },
   },
   {
      sequelize,
      timestamps: false,
   }
);

Category.hasMany(CategoryAttribute, {
   as: "attributes",
   foreignKey: "category_id",
});

Category.hasMany(Brand, {
   foreignKey: "category_id",
   as: "brands",
});

Category.hasMany(PriceRange, {
   foreignKey: "category_id",
   as: "price_ranges",
});

Category.hasOne(CategorySlider, {
   foreignKey: "category_id",
   as: "category_slider",
});

Product.belongsTo(Category, {
   foreignKey: "category_id",
   as: 'category'
});

export default Category;
