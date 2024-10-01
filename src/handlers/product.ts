import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import productSchema from "../schemas/product";
import ObjectNotFound from "../errors/ObjectNotFound";
import Product from "../models/product";
import Description from "../models/description";
import DefaultProductVariant from "../models/defaultProductVariant";
import Variant from "../models/variant";
import DefaultVariantCombine from "../models/defaultVariantCombine";
import Category from "../models/category";
import CategoryAttribute from "../models/categoryAttribute";
import Color from "../models/color";
import ProductSlider from "../models/productSlider";
import Slider from "../models/slider";
import Image from "../models/image";
import SliderImage from "../models/sliderImage";
import Combine from "../models/combine";
import { Filterable, FindOptions, InferAttributes, Op } from "sequelize";
import { Sort } from "../types/type";
import { generateId } from "../system/helper";

const PAGE_SIZE = 6;

interface Query {
   page: number;
   category_id: number;
   brand_id: string[];
   price: string[];
   size: string;
}

class ProductHandler {
   async findAll(
      req: Request<{}, {}, {}, Query>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const query = req.query;
         const { page, brand_id, category_id, price, size } = query;
         const sort = res.locals.sort as Sort;

         const _size =
            (size && typeof size === "string" && +size < 12 && +size) ||
            PAGE_SIZE;
         const _page = (page && typeof page === "string" && +page) || 1;

         const where: Filterable<
            InferAttributes<Product, { omit: never }>
         >["where"] = {};
         const combineWhere: Filterable<
            InferAttributes<Combine, { omit: never }>
         >["where"] = {};
         const order: FindOptions<
            InferAttributes<Product, { omit: never }>
         >["order"] = [["id", "DESC"]];

         if (category_id) where.category_id = category_id;

         if (brand_id)
            where.brand_id = {
               [Op.in]: brand_id,
            };

         if (price) {
            const [gThan, lThan] = price;
            if (!Number.isNaN(+gThan) && !Number.isNaN(+lThan)) {
               combineWhere.price = {
                  [Op.and]: {
                     [Op.gt]: +gThan * 1000000,
                     [Op.lt]: +lThan * 1000000,
                  },
               };
            }
         }
         if (sort.enable) {
            // if (sort.column === "price") {
            // order.push([
            //    { model: DefaultProductVariant, as: "default_variant" },
            //    {
            //       model: Variant,
            //       as: "variant",
            //    },
            //    {
            //       model: DefaultVariantCombine,
            //       as: "default_combine",
            //    },
            //    {
            //       model: Combine,
            //       as: "combine",
            //    },
            //    sort.column,
            //    sort.type,
            // ]);

            // }

            if (sort.column === "price") {
               order.push([
                  "default_variant",
                  "variant",
                  "default_combine",
                  "combine",
                  sort.column,
                  sort.type,
               ]);
            }
         }

         const { count, rows } = await Product.findAndCountAll({
            offset: (_page - 1) * _size,
            limit: _size,
            distinct: true,
            include: [
               {
                  required: true,
                  model: DefaultProductVariant,
                  as: "default_variant",
                  include: [
                     {
                        required: true,
                        model: Variant,
                        as: "variant",
                        include: [
                           {
                              required: true,
                              model: DefaultVariantCombine,
                              as: "default_combine",
                              include: [
                                 {
                                    required: true,
                                    model: Combine,
                                    as: "combine",
                                    // order,
                                    where: combineWhere,
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               },
               {
                  model: Variant,
                  as: "variants",
                  include: [
                     {
                        model: DefaultVariantCombine,
                        as: "default_combine",
                        include: [
                           {
                              model: Combine,
                              as: "combine",
                           },
                        ],
                     },
                  ],
               },
            ],
            order,
            where,
         });

         return myResponse(res, true, "get all product successful", 200, {
            products: rows,
            count,
            page: _page,
            size: _size,
            sort: sort.enable,
            category_id: +category_id || null,
            brand_id: brand_id?.length ? brand_id : null,
            column: sort.enable ? sort.column : null,
            type: sort.enable ? sort.type : null,
         });
      } catch (error) {
         next(error);
      }
   }

   async findOne(
      req: Request<{ productId: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productId } = req.params;

         const product = await Product.findByPk(productId, {
            include: [
               {
                  model: Category,
                  as: "category",
                  include: [
                     {
                        model: CategoryAttribute,
                        as: "attributes",
                     },
                  ],
               },
               {
                  model: Variant,
                  as: "variants",
                  include: [
                     {
                        model: DefaultVariantCombine,
                        as: "default_combine",
                     },
                  ],
               },
               Product.associations.default_variant,
               Product.associations.combines,
               {
                  model: Color,
                  as: "colors",
                  include: [
                     {
                        model: ProductSlider,
                        as: "product_slider",
                        include: [
                           {
                              model: Slider,
                              as: "slider",
                              include: [
                                 {
                                    model: SliderImage,
                                    as: "slider_images",
                                    include: [
                                       {
                                          model: Image,
                                          as: "image",
                                       },
                                    ],
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               },
               Product.associations.attributes,
               Product.associations.description,
            ],
         });

         return myResponse(res, true, "get product successful", 200, product);
      } catch (error) {
         next(error);
      }
   }

   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body as Product;
         const value = productSchema.validate(body);

         // check
         if (value.error) throw new BadRequest(value.error.message);
         if (!body.category_id || !body.brand_id) throw new BadRequest("");

         const founded = await Product.findOne({
            where: {
               name_ascii: body.name_ascii,
            },
         });

         if (founded)
            return myResponse(res, false, "Product name already exist", 409);

         const newProduct = await Product.create(body);

         await new Description({
            content: newProduct.name,
            product_id: newProduct.id,
         }).save();

         await new DefaultProductVariant({
            product_id: newProduct.id,
         }).save();

         return myResponse(
            res,
            true,
            "add product successful",
            200,
            newProduct
         );
      } catch (error) {
         next(error);
      }
   }

   async update(
      req: Request<{ productId: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productId } = req.params;
         const body = req.body;
         // const value = productSchema.validate(body);

         const item = await Product.findByPk(productId);
         if (!item) throw new ObjectNotFound("");

         const founded = await Product.findOne({
            where: {
               name_ascii: body.name_ascii,
            },
         });

         if (founded)
            return myResponse(res, false, "Product name already exist", 409);

         // if (value.error) throw new BadRequest(value.error.message);
         await item.update(body);

         await Product.update(body, { where: { id: +productId } });

         return myResponse(res, true, "update product successful", 200);
      } catch (error) {
         next(error);
      }
   }

   async search(
      req: Request<{}, {}, {}, { q: string; page: string; size: string }>,
      res: Response,
      next: NextFunction
   ) {
      const { q, page, size } = req.query;

      const _size =
         (size && typeof size === "string" && +size < 12 && +size) || PAGE_SIZE;
      const _page = (page && typeof page === "string" && +page) || 1;

      const sort = res.locals.sort as Sort;
      const order = [];

      if (sort.enable) {
         if (sort.column === "price") {
            order.push([
               { model: DefaultProductVariant, as: "default_variant" },
               {
                  model: Variant,
                  as: "variant",
               },
               {
                  model: DefaultVariantCombine,
                  as: "default_combine",
               },
               {
                  model: Combine,
                  as: "combine",
               },
               sort.column,
               sort.type,
            ]);
         }
      }

      const { count, rows } = await Product.findAndCountAll({
         offset: (_page - 1) * _size,
         limit: _size,
         distinct: true,
         include: [
            {
               model: DefaultProductVariant,
               as: "default_variant",
               include: [
                  {
                     model: Variant,
                     as: "variant",
                     include: [
                        {
                           model: DefaultVariantCombine,
                           as: "default_combine",
                           include: [
                              {
                                 model: Combine,
                                 as: "combine",
                              },
                           ],
                        },
                     ],
                  },
               ],
            },
            {
               model: Variant,
               as: "variants",
               include: [
                  {
                     model: DefaultVariantCombine,
                     as: "default_combine",
                     include: [
                        {
                           model: Combine,
                           as: "combine",
                        },
                     ],
                  },
               ],
            },
         ],
         where: {
            name_ascii: { [Op.like]: `${generateId(q)}%` },
         },
      });

      return myResponse(res, true, "search product successful", 200, {
         products: rows,
         count,
         page_size: _size,
         page: _page,
         sort: sort.enable,
         column: sort.enable ? sort.column : null,
         type: sort.enable ? sort.type : null,
      });
   }

   async delete(
      req: Request<{ productId: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productId } = req.params;

         const item = await Product.findByPk(productId);
         if (!item) throw new ObjectNotFound("");

         // await item.product_slider.slider.destroy();

         await item.destroy();

         return myResponse(res, true, "delete price range successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new ProductHandler();
