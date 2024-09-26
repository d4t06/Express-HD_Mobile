import { NextFunction, Request, Response } from "express";
import { Sort } from "../types/type";
import { Filterable, InferAttributes, Op } from "sequelize";

import myResponse from "../system/myResponse";
import ObjectNotFound from "../errors/ObjectNotFound";
import ProductService from "../services/product";
import {
   Description,
   Product,
   Color,
   Variant,
   Combine,
   ProductAttribute,
   ProductSlider,
   Slider,
   SliderImage,
   DefaultProductVariant,
   DefaultVariantCombine,
} from "../models";
import { when } from "joi";
import { generateId, getProductName } from "../system/helper";

const PAGE_SIZE = 6;

interface Query {
   page: number;
   category_id: number;
   price: string[];
   size: string;
}

class ProductManagement {
   async findAll(
      req: Request<{}, {}, {}, Query>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const query = req.query;
         const { page, category_id, size } = query;
         const sort = res.locals.sort as Sort;

         const _size =
            (size && typeof size === "string" && +size < 12 && +size) ||
            PAGE_SIZE;
         const _page = (page && typeof page === "string" && +page) || 1;

         const where: Filterable<
            InferAttributes<Product, { omit: never }>
         >["where"] = {};

         if (category_id) where.category_id = category_id;

         const { count, rows } = await Product.findAndCountAll({
            offset: (_page - 1) * _size,
            limit: _size,
            distinct: true,
            where,
         });

         return myResponse(res, true, "get all product successful", 200, {
            products: rows,
            count,
            page: _page,
            size: _size,
            sort: sort.enable,
            category_id: +category_id || null,
            column: sort.enable ? sort.column : null,
            type: sort.enable ? sort.type : null,
         });
      } catch (error) {
         next(error);
      }
   }

   async duplicate(
      req: Request<{ id: string }, {}, {}, Query>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { id } = req.params;

         const foundedProduct = await ProductService.findOne(id);
         if (!foundedProduct) throw new ObjectNotFound("");

         const otherProductNames = await Product.findAll({
            where: {
               name_ascii: { [Op.like]: `${foundedProduct.name_ascii}%` },
            },
         });

         const newProductName = getProductName(
            otherProductNames.map((p) => p.name),
            foundedProduct.name
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
            const sliderImageSchemas =
               color.product_slider.slider.slider_images.map((sI) => ({
                  image_id: sI.image_id,
                  link_to: sI.link_to,
                  slider_id: newSlider.id,
               }));

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
                  (c) =>
                     c.color_id === oldColorId && c.variant_id === oldVariantId
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
               (i) => i === foundedProduct.default_variant.variant_id
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
               (c) => c.id === oldVariant.default_combine.combine_id
            );

            // get old combine id
            const oldColorIdIndex = colorIdList.findIndex(
               (i) => i === oldCombine?.color_id
            );

            const newCombineIndex = newCombines.findIndex(
               (c) =>
                  c.variant_id === newVariants[i].id &&
                  c.color_id ===
                     (!!newColors[oldColorIdIndex]
                        ? newColors[oldColorIdIndex].id
                        : null)
            );

            // must create
            await DefaultVariantCombine.create({
               variant_id: newVariants[i].id,
               combine_id: newCombines[newCombineIndex]?.id,
            });
         }

         return myResponse(
            res,
            true,
            "Duplicate product successful",
            200,
            newProduct
         );
      } catch (error) {
         next(error);
      }
   }
}

export default new ProductManagement();
