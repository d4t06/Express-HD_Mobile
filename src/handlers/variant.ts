import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import variantSchema from "../schemas/variant";
import ObjectNotFound from "../errors/ObjectNotFound";
import Variant from "../models/variant";
import Color from "../models/color";
import Combine from "../models/combine";
import DefaultVariantCombine from "../models/defaultVariantCombine";

class variantHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = variantSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         const newVariant = await Variant.create(body);

         const defaultCombine = await new DefaultVariantCombine({
            variant_id: newVariant.id,
         }).save();

         const colors = await Color.findAll({
            where: {
               product_ascii: newVariant.product_ascii,
            },
         });

         const newCombines: Combine[] = [];

         for await (const c of colors) {
            const combine = await new Combine({
               color_id: c.id,
               price: 0,
               quantity: 0,
               product_ascii: newVariant.product_ascii,
               variant_id: newVariant.id,
            }).save();

            newCombines.push(combine);
         }

         const newCombineWithAssociation = await Variant.findByPk(newVariant.id, {
            include: [Variant.associations.default_combine],
         });

         if (!newCombineWithAssociation) throw new ObjectNotFound("");

         return myResponse(res, true, "add variant successful", 200, {
            variant: newCombineWithAssociation,
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
         const value = variantSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await Variant.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await Variant.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(res, true, "update variant successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await Variant.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(res, true, "delete variant successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new variantHandler();
