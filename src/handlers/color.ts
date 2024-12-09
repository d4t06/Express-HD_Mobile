import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import colorSchema from "../schemas/color";
import ObjectNotFound from "../errors/ObjectNotFound";

import Color from "../models/color";
import ProductSlider from "../models/productSlider";
import Slider from "../models/slider";
import Variant from "../models/variant";
import Combine from "../models/combine";
import SliderImage from "../models/sliderImage";
import Image from "../models/image";

import { generateId } from "../system/helper";

class colorHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = colorSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         const color = await Color.create({ ...body, name_ascii: generateId(body.name) });

         // add slider
         const newSlider = await new Slider({
            name: `for ${color.product_id} ${color.name_ascii}`,
         }).save();

         await new ProductSlider({
            color_id: color.id,
            product_id: color.product_id,
            slider_id: newSlider.id,
         }).save();

         const variants = await Variant.findAll({
            where: {
               product_id: color.product_id,
            },
         });

         const newCombines: Combine[] = [];

         for await (const v of variants) {
            const combine = await new Combine({
               color_id: color.id,
               price: 0,
               quantity: 0,
               product_id: color.product_id,
               variant_id: v.id,
            }).save();

            newCombines.push(combine);
         }

         const newColor = await Color.findByPk(color.id, {
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
         });

         return myResponse(res, true, "add color successful", 200, {
            color: newColor,
            combines: newCombines,
         });
      } catch (error) {
         next(error);
      }
   }

   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = colorSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await Color.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await Color.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(res, true, "update color successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await Color.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(res, true, "delete color successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new colorHandler();
