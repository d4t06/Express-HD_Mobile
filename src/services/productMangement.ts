import {
   Color,
   Combine,
   DefaultProductVariant,
   DefaultVariantCombine,
   Description,
   Product,
   ProductAttribute,
   ProductSlider,
   Slider,
   SliderImage,
   Variant,
} from "../models";
import { generateId } from "../system/helper";
import myResponse from "../system/myResponse";

import ImageService from "./image";

type JsonProduct = {
   name: string;
   category_id: number;
   brand_id: number;
   colors: string[];
   variants: string[];
   attributes: { category_attribute_id: number; value: string }[];
   image: string;
   sliders: string[];
   price: number;
};

class ProductManagementService {
   async jsonImporter(jsonProduct: JsonProduct) {
      const foundedProduct = await Product.findOne({
         where: {
            name_ascii: generateId(jsonProduct.name),
         },
      });

      if (foundedProduct) return;

      /** upload product image */
      const newProductImage = await ImageService.upload(jsonProduct.image);

      /** create product */
      const newProduct = await new Product({
         brand_id: jsonProduct.brand_id,
         category_id: jsonProduct.category_id,
         name: jsonProduct.name,
         name_ascii: generateId(jsonProduct.name),
         image_url: newProductImage.image_url,
      }).save();

      /** description */
      await new Description({
         content: newProduct.name,
         product_id: newProduct.id,
      }).save();

      /** color */
      const colorSchemas = jsonProduct.colors.map((c) => ({
         name: c,
         name_ascii: generateId(c),
         product_id: newProduct.id,
      }));

      const newColors = await Color.bulkCreate(colorSchemas);

      /** variant */
      const variantSchemas = jsonProduct.variants.map((v) => ({
         product_id: newProduct.id,
         name: v,
         name_ascii: generateId(v),
      }));
      const newVariants = await Variant.bulkCreate(variantSchemas);

      if (jsonProduct.image.length) {
         /** create slider */
         const newSlider = await Slider.create({
            name: newProduct.id + newColors[0].name_ascii,
         });

         // slider images
         const sliderImageSchemas = [];

         let counter = 0;
         for (const imageUrl of jsonProduct.sliders) {
            if (counter > 3) break;
            const newImage = await ImageService.upload(imageUrl);

            const schema = {
               image_id: newImage.id,
               link_to: "",
               slider_id: newSlider.id,
            };

            sliderImageSchemas.push(schema);
            counter++;
         }

         await SliderImage.bulkCreate(sliderImageSchemas);

         // product slider
         await ProductSlider.create({
            color_id: newColors[0].id,
            product_id: newProduct.id,
            slider_id: newSlider.id,
         });
      }

      /** attributes */
      const attributeSchemas = jsonProduct.attributes.map((a) => ({
         category_attribute_id: a.category_attribute_id,
         product_id: newProduct.id,
         value: a.value,
      }));
      await ProductAttribute.bulkCreate(attributeSchemas);

      /** combines */
      const combineSchemas = [];
      for (let i = 0; i < newColors.length; i++) {
         for (let j = 0; j < newVariants.length; j++) {
            const newCombineSchema = {
               color_id: newColors[i].id,
               variant_id: newVariants[j].id,
               price: jsonProduct.price,
               product_id: newProduct.id,
               quantity: 1,
            };

            combineSchemas.push(newCombineSchema);
         }
      }
      const newCombines = await Combine.bulkCreate(combineSchemas);

      /** default variant */
      await DefaultProductVariant.create({
         product_id: newProduct.id,
         variant_id: newVariants[0].id,
      });

      /** default combine */
      await DefaultVariantCombine.create({
         variant_id: newVariants[0].id,
         combine_id: newCombines[0].id,
      });

      return newProduct;
   }
}

export default new ProductManagementService();
