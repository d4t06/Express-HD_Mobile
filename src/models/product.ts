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
import {
  Color,
  Variant,
  ProductAttribute,
  Combine,
  Description,
  DefaultProductVariant,
  ProductSlider,
  CartItem,
  ProductRating,
  Category,
} from ".";

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare name_ascii: string;
  declare image_url: string;
  declare category_id: ForeignKey<number>;
  declare category: NonAttribute<Category>;
  declare brand_id: ForeignKey<number>;
  declare combines: NonAttribute<Combine[]>;
  declare variants: NonAttribute<Variant[]>;
  declare colors: NonAttribute<Color[]>;
  declare description: NonAttribute<Description>;
  declare default_variant: NonAttribute<Variant>;
  declare attributes: NonAttribute<ProductAttribute[]>;
  declare product_sliders: NonAttribute<ProductSlider[]>;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name_ascii: {
      unique: true,
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
  foreignKey: "product_id",
  as: "colors",
});

Product.hasMany(Variant, {
  foreignKey: "product_id",
  as: "variants",
});

Product.hasMany(ProductAttribute, {
  foreignKey: "product_id",
  as: "attributes",
});

Product.hasMany(Combine, {
  foreignKey: "product_id",
  as: "combines",
});

Product.hasOne(Description, {
  foreignKey: "product_id",
  as: "description",
});

Product.hasOne(DefaultProductVariant, {
  foreignKey: "product_id",
  as: "default_variant",
});

Product.hasOne(ProductRating, {
  foreignKey: "product_id",
  as: "ratings",
});

Product.hasMany(ProductSlider, {
  as: "product_sliders",
  foreignKey: "product_id",
});
// ProductSlider.belongsTo(Product);

CartItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

export default Product;
