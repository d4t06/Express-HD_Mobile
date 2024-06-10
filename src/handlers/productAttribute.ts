import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import ProductAttribute from "../models/productAttribute";
import productAttributeSchema from "../schemas/productAttribute";
import ObjectNotFound from "../errors/ObjectNotFound";

class ProductAttributeHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = productAttributeSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         const item = await ProductAttribute.create(body);

         return myResponse(res, true, "add attribute successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = productAttributeSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const oldBrand = await ProductAttribute.findByPk(id);
         if (!oldBrand) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await ProductAttribute.update(body, { where: { id } });

         Object.assign(oldBrand, body);

         return myResponse(res, true, "update attribute successful", 200, oldBrand);
      } catch (error) {
         next(error);
      }
   }
}

export default new ProductAttributeHandler();
