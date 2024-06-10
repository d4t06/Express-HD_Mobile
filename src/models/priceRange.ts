import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class PriceRange extends Model<
   InferAttributes<PriceRange>,
   InferCreationAttributes<PriceRange>
> {
   declare id: CreationOptional<number>;
   declare category_id: ForeignKey<number>;
   declare label: string;
   declare from: number;
   declare to: string;
}

PriceRange.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      category_id: {
         allowNull: false,
         type: DataTypes.INTEGER,
      },
      label: {
         allowNull: false,
         type: DataTypes.STRING,
      },
      from: {
         type: DataTypes.INTEGER,
      },
      to: {
         type: DataTypes.INTEGER,
      },
   },
   {
      sequelize,
      timestamps: false,
      tableName: 'Price_Ranges'
   }
);

export default PriceRange;
