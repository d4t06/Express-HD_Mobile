import {
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
   NonAttribute,
} from "sequelize";

import sequelize from "../config/sequelize";
import Color from "./color";
import Variant from "./variant";
import ProductAttribute from "./productAttribute";
import Combine from "./combine";
import Description from "./description";
import DefaultProductVariant from "./defaultProductVariant";
import ProductSlider from "./productSlider";
import CartItem from "./cartItem";

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
   declare product_ascii: string;
   declare product: string;
   declare image_url: string;
   declare category_id: ForeignKey<number>;
   declare brand_id: ForeignKey<number>;
   declare combines: NonAttribute<Combine[]>;
   declare variants: NonAttribute<Variant[]>;
   declare colors: NonAttribute<Color[]>;
   declare description: NonAttribute<Description>;
   declare default_variant: NonAttribute<Variant>;
}

Product.init(
   {
      product_ascii: {
         type: DataTypes.STRING,
         primaryKey: true,
      },
      product: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      image_url: {
         type: DataTypes.STRING,
      },
      category_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      brand_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Products",
   }
);

Product.hasMany(Color, {
   foreignKey: "product_ascii",
   as: "colors",
});

Product.hasMany(Variant, {
   foreignKey: "product_ascii",
   as: "variants",
});

Product.hasMany(ProductAttribute, {
   foreignKey: "product_ascii",
   as: "attributes",
});

Product.hasMany(Combine, {
   foreignKey: "product_ascii",
   as: "combines",
});

Product.hasOne(Description, {
   foreignKey: "product_ascii",
   as: "description",
});

Product.hasOne(DefaultProductVariant, {
   foreignKey: "product_ascii",
   as: "default_variant",
});

ProductSlider.belongsTo(Product, {
   foreignKey: "product_ascii",
});

CartItem.belongsTo(Product, {
   foreignKey: "product_ascii",
   as: "product",
});

export default Product;
