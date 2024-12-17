import { Op } from "sequelize";
import ObjectNotFound from "../errors/ObjectNotFound";
import {
   Color,
   Combine,
   DefaultProductVariant,
   DefaultVariantCombine,
   Description,
   Image,
   ProductAttribute,
   ProductSlider,
   Slider,
   SliderImage,
   Variant,
} from "../models";
import { generateId, getProductName } from "../system/helper";

import CloudinaryService from "./cloudinary";
import ProductService from "./product";
import Product from "../models/product";

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
   description: string;
};

class ProductManagementService {
   async jsonImporter(jsonProduct: JsonProduct) {
      const start = Date.now();

      const foundedProduct = await Product.findOne({
         where: {
            name_ascii: generateId(jsonProduct.name),
         },
      });

      if (foundedProduct) return;

      /** create product */
      const newProduct = await new Product({
         brand_id: jsonProduct.brand_id,
         category_id: jsonProduct.category_id,
         name: jsonProduct.name,
         name_ascii: generateId(jsonProduct.name),
         image_url: "",
      }).save();

      /** description */
      await new Description({
         content: jsonProduct.description,
         product_id: newProduct.id,
      }).save();

      /** color */
      console.log((Date.now() - start) / 1000 + "s", ">>> Save colors: ");
      const colorSchemas = jsonProduct.colors.map((c) => ({
         name: c,
         name_ascii: generateId(c),
         product_id: newProduct.id,
      }));

      const newColors = await Color.bulkCreate(colorSchemas);

      /** variant */
      console.log((Date.now() - start) / 1000 + "s", ">>> Save variant: ");
      const variantSchemas = jsonProduct.variants.map((v) => ({
         product_id: newProduct.id,
         name: v,
         name_ascii: generateId(v),
      }));
      const newVariants = await Variant.bulkCreate(variantSchemas);

      console.log((Date.now() - start) / 1000 + "s", ">>> Upload image: ");

      /** slider images */
      const imageRes = await Promise.all([
         CloudinaryService.upload(jsonProduct.image),
         ...jsonProduct.sliders.map((url) => CloudinaryService.upload(url)),
      ]);

      console.log((Date.now() - start) / 1000 + "s", ">>> Save image: ");

      const imageSchemas = imageRes.map((res) => ({
         name: Date.now() + "",
         public_id: res.public_id,
         image_url: res.secure_url,
         size: Math.ceil(res.bytes / 1024),
      }));

      const newImages = await Image.bulkCreate(imageSchemas);

      const [productImage, ...restImages] = newImages;

      console.log((Date.now() - start) / 1000 + "s", ">>> Update product image: ");

      await newProduct.set("image_url", productImage.image_url).save();

      console.log((Date.now() - start) / 1000 + "s", ">>> Save slider: ");

      for (let index = 0; index < newColors.length; index++) {
         const newColor = newColors[index];

         const newSlider = await Slider.create({
            name: newProduct.id + newColor.name_ascii,
         });

         await ProductSlider.create({
            color_id: newColor.id,
            product_id: newProduct.id,
            slider_id: newSlider.id,
         });

         if (index === 0) {
            const sliderImageSchemas = [];

            for (const image of restImages) {
               const schema = {
                  image_id: image.id,
                  link_to: "",
                  slider_id: newSlider.id,
               };

               sliderImageSchemas.push(schema);
            }

            await SliderImage.bulkCreate(sliderImageSchemas);
         }
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

      console.log(
         ">>> Import product successful ",
         newProduct.name,
         (Date.now() - start) / 1000 + "s",
      );

      return newProduct;
   }

   async duplicate(id: number) {
      const foundedProduct = await ProductService.findOne(id);
      if (!foundedProduct) throw new ObjectNotFound("");

      const otherProductNames = await Product.findAll({
         where: {
            name_ascii: { [Op.like]: `${foundedProduct.name_ascii}%` },
         },
      });

      const newProductName = getProductName(
         otherProductNames.map((p) => p.name),
         foundedProduct.name,
      );

      const newProduct = await new Product({
         name: newProductName,
         brand_id: foundedProduct.brand_id,
         category_id: foundedProduct.category_id,
         name_ascii: generateId(newProductName),
         image_url: foundedProduct.image_url,
      }).save();

      //** duplicate product */

      //** description */
      await new Description({
         content: newProductName,
         product_id: newProduct.id,
      }).save();

      //** attributes */
      const attributeSchemas = foundedProduct.attributes.map((a) => ({
         category_attribute_id: a.category_attribute_id,
         product_id: newProduct.id,
         value: a.value,
      }));
      await ProductAttribute.bulkCreate(attributeSchemas);

      //** colors */
      const colorIdList = foundedProduct.colors.map((c) => c.id);
      const colorSchemas = foundedProduct.colors.map((c) => ({
         name: c.name,
         name_ascii: c.name_ascii,
         product_id: newProduct.id,
      }));

      const newColors = await Color.bulkCreate(colorSchemas);

      //** variants */
      const variantIdList = foundedProduct.variants.map((v) => v.id);
      const variantSchemas = foundedProduct.variants.map((c) => ({
         name: c.name,
         name_ascii: c.name_ascii,
         product_id: newProduct.id,
      }));
      const newVariants = await Variant.bulkCreate(variantSchemas);

      /** color slider */
      for (let i = 0; i < foundedProduct.colors.length; i++) {
         const color = foundedProduct.colors[i];

         // slider
         const newSlider = await Slider.create({
            name: newProduct.id + color.name,
         });

         // slider images
         const sliderImageSchemas = color.product_slider.slider.slider_images.map(
            (sI) => ({
               image_id: sI.image_id,
               link_to: sI.link_to,
               slider_id: newSlider.id,
            }),
         );

         await SliderImage.bulkCreate(sliderImageSchemas);

         // product slider
         await ProductSlider.create({
            color_id: newColors[i].id,
            product_id: newProduct.id,
            slider_id: newSlider.id,
         });
      }

      //** combines */
      const combineSchemas = [];

      for (let i = 0; i < newColors.length; i++) {
         const oldColorId = colorIdList[i];

         for (let j = 0; j < newVariants.length; j++) {
            const oldVariantId = variantIdList[j];

            const foundedCombine = foundedProduct.combines.find(
               (c) => c.color_id === oldColorId && c.variant_id === oldVariantId,
            );
            if (!foundedCombine) continue;

            const newCombineSchema = {
               color_id: newColors[i].id,
               variant_id: newVariants[j].id,
               price: foundedCombine.price,
               product_id: newProduct.id,
               quantity: foundedCombine.quantity,
            };

            combineSchemas.push(newCombineSchema);
         }
      }

      const newCombines = await Combine.bulkCreate(combineSchemas);

      /** default variant */
      // @ts-ignore
      if (foundedProduct.default_variant?.variant_id) {
         const indexInList = variantIdList.findIndex(
            // @ts-ignore
            (i) => i === foundedProduct.default_variant.variant_id,
         );

         await DefaultProductVariant.create({
            product_id: newProduct.id,
            variant_id: newVariants[indexInList].id,
         });
      }

      /** default variant combine */
      for (let i = 0; i < foundedProduct.variants.length; i++) {
         const oldVariant = foundedProduct.variants[i];

         const oldCombine = foundedProduct.combines.find(
            (c) => c.id === oldVariant.default_combine.combine_id,
         );

         // get old combine id
         const oldColorIdIndex = colorIdList.findIndex((i) => i === oldCombine?.color_id);

         const newCombineIndex = newCombines.findIndex(
            (c) =>
               c.variant_id === newVariants[i].id &&
               c.color_id ===
                  (!!newColors[oldColorIdIndex] ? newColors[oldColorIdIndex].id : null),
         );

         // must create
         await DefaultVariantCombine.create({
            variant_id: newVariants[i].id,
            combine_id: newCombines[newCombineIndex]?.id,
         });
      }

      return newProduct;
   }
}

export default new ProductManagementService();
