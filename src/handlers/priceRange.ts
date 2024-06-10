import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import ObjectNotFound from "../errors/ObjectNotFound";
import PriceRange from "../models/priceRange";
import priceRangeSchema from "../schemas/priceRange";

class priceRangeHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = priceRangeSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         const brand = await PriceRange.create(body);

         return myResponse(res, true, "add price range successful", 200, brand);
      } catch (error) {
         next(error);
      }
   }

   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = priceRangeSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await PriceRange.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await PriceRange.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(res, true, "update price range successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await PriceRange.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(res, true, "delete price range successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new priceRangeHandler();
