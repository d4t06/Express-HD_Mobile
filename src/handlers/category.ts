import { NextFunction, Request, Response } from "express";

import Category from "../models/category";
import Image from "../models/image";
import Brand from "../models/brand";
import Slider from "../models/slider";
import CategorySlider from "../models/categorySlider";
import SliderImage from "../models/sliderImage";

import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import ObjectNotFound from "../errors/ObjectNotFound";
import categorySchema from "../schemas/category";
import { generateId } from "../system/helper";
import categoryService from "../services/category";
import { CategoryAttribute } from "../models";

class categoryHandler {
   async findAll(_req: Request, res: Response, next: NextFunction) {
      try {
         const categories = await Category.findAll({
            include: [
               Category.associations.brands,
               Category.associations.attributes,
               Category.associations.price_ranges,
               {
                  model: CategorySlider,
                  as: "category_slider",
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
         });

         return myResponse(res, true, "get all categories", 200, categories);
      } catch (error) {
         next(error);
      }
   }

   async findAllLess(_req: Request, res: Response, next: NextFunction) {
      try {
         const categories = await Category.findAll({
            include: [
               {
                  model: Brand,
                  as: "brands",
                  attributes: ["name_ascii", "id"],
               },
               {
                  model: CategoryAttribute,
                  as: "attributes",
                  attributes: ["name_ascii", "id"],
               },
            ],
            attributes: ["name_ascii", "id"],
            where: {
               hidden: false,
            },
         });

         return res.json(categories);
      } catch (error) {
         next(error);
      }
   }

   async add(req: Request<{}, {}, Category>, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = categorySchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);

         const founded = await Category.findOne({
            where: {
               name_ascii: generateId(body.name),
            },
         });

         if (founded) return myResponse(res, false, "Category already exist", 409);

         const category = await Category.create({
            ...body,
            name_ascii: generateId(body.name),
         });

         // create slider
         const slider = await Slider.create({
            name: `slider for ${category.name}`,
         });

         await CategorySlider.create({
            category_id: category.id,
            slider_id: slider.id,
         });

         const newCategory = await Category.findByPk(category.id, {
            include: [
               Category.associations.brands,
               Category.associations.attributes,
               Category.associations.price_ranges,
               {
                  model: CategorySlider,
                  as: "category_slider",
                  include: [
                     {
                        model: Slider,
                        as: "slider",
                        include: [
                           {
                              model: SliderImage,
                              as: "slider_images",
                           },
                        ],
                     },
                  ],
               },
            ],
         });

         return myResponse(res, true, "add category successful", 200, newCategory);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }

   async update(
      req: Request<{ id: number }, {}, Category>,
      res: Response,
      next: NextFunction,
   ) {
      try {
         const body = req.body;
         const { id } = req.params;

         const value = categorySchema.validate(body);
         if (value.error) throw new BadRequest(value.error.message);

         const founded = await Brand.findOne({
            where: {
               name_ascii: body.name_ascii,
            },
         });

         if (founded) return myResponse(res, false, "Category already exist", 409);

         const item = await Category.findByPk(id);

         if (!item) throw new ObjectNotFound("");

         await item.update(body);

         Object.assign(item, body);

         return myResponse(res, true, "update category successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const category = await Category.findByPk(+id, {
            include: [
               {
                  model: CategorySlider,
                  as: "category_slider",
                  include: [CategorySlider.associations.slider],
               },
            ],
         });
         if (!category) throw new ObjectNotFound("");

         if (category.category_slider) await category.category_slider.slider.destroy();

         await category.destroy();

         return myResponse(res, true, "delete category successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }

   async import(req: Request<{}, {}, { data: any }>, res: Response, next: NextFunction) {
      try {
         const { data } = req.body;
         const newCategories = await categoryService.import(data);

         return myResponse(res, true, "Import category successful", 200, newCategories);
      } catch (error) {
         next(error);
      }
   }
}

export default new categoryHandler();
