import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import combineSchema from "../schemas/combine";
import ObjectNotFound from "../errors/ObjectNotFound";
import Combine from "../models/combine";

class priceRangeHandler {
   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = combineSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await Combine.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await Combine.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(res, true, "update combine successful", 200, item);
      } catch (error) {
         next(error);
      }
   }
}

export default new priceRangeHandler();
