import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import DefaultVariantCombine from "../models/defaultVariantCombine";
import defaultVariantCombineSchema from "../schemas/defaultVariantCombine";
import ObjectNotFound from "../errors/ObjectNotFound";

class BrandHandler {
   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = defaultVariantCombineSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await DefaultVariantCombine.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await DefaultVariantCombine.update(body, { where: { id } });

         return myResponse(res, true, "update default variant combine successful", 200);
      } catch (error) {
         next(error);
      }
   }
}

export default new BrandHandler();
