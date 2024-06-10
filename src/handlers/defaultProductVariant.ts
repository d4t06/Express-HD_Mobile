import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import DefaultProductVariant from "../models/defaultProductVariant";
import defaultProductVariantSchema from "../schemas/defaultProductVariant";
import ObjectNotFound from "../errors/ObjectNotFound";

class BrandHandler {
   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = defaultProductVariantSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await DefaultProductVariant.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await DefaultProductVariant.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(res, true, "update default product variant successful", 200);
      } catch (error) {
         next(error);
      }
   }
}

export default new BrandHandler();
