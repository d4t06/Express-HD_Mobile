import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class Description extends Model<
   InferAttributes<Description>,
   InferCreationAttributes<Description>
> {
   declare id: CreationOptional<number>;
   declare product_id: ForeignKey<number>;
   declare content: string;
}

Description.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      product_id: {
         allowNull: false,
         type: DataTypes.NUMBER,
      },
      content: {
         type: DataTypes.TEXT,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: "Product_Descriptions",
   }
);

export default Description;
