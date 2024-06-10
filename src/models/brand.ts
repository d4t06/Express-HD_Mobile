import {
   CreationOptional,
   DataTypes,
   ForeignKey,
   InferAttributes,
   InferCreationAttributes,
   Model,
} from "sequelize";

import sequelize from "../config/sequelize";

class Brand extends Model<InferAttributes<Brand>, InferCreationAttributes<Brand>> {
   declare id: CreationOptional<number>;
   declare category_id: ForeignKey<number>;
   declare brand: string;
   declare brand_ascii: string;
   declare image_url: string;
}

Brand.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      brand: {
         type: DataTypes.STRING,
      },
      brand_ascii: {
         type: DataTypes.STRING,
      },
      image_url: {
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      timestamps: false,
   }
);

export default Brand;
