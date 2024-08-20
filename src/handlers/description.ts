import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import Description from "../models/description";
import descriptionSchema from "../schemas/description";
import ObjectNotFound from "../errors/ObjectNotFound";

class BrandHandler {
   async update(
      req: Request<{ productId: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { productId } = req.params;
         const body = req.body;
         const value = descriptionSchema.validate(body);
         if (value.error) throw new BadRequest(value.error.message);

         const oldDesc = await Description.findOne({where: {product_id: productId}});
         if (!oldDesc) throw new ObjectNotFound("");

         await Description.update(body, { where: { product_id: productId } });

         return myResponse(res, true, "update description successful", 200);
      } catch (error) {
         next(error);
      }
   }
}

export default new BrandHandler();
