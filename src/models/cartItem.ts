import {
   CreationOptional,
   DataTypes,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class CartItem extends Model<
   InferAttributes<CartItem>,
   InferCreationAttributes<CartItem>
> {
   declare id: CreationOptional<number>;
   declare username: string;
   declare product_id: number;
   declare color_id: number;
   declare variant_id: number;
   declare amount: number;
}

CartItem.init(
   {
      id: {
         type: DataTypes.NUMBER,
         primaryKey: true,
         autoIncrement: true,
      },
      username: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      product_id: {
         type: DataTypes.NOW,
         allowNull: false,
      },
      color_id: {
         type: DataTypes.NUMBER,
         allowNull: false,
      },
      variant_id: {
         type: DataTypes.NUMBER,
      },
      amount: {
         type: DataTypes.NUMBER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Cart_Items",
   }
);

export default CartItem;
