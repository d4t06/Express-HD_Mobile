import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import categoryAttribute from "../schemas/categoryAttribute";
import ObjectNotFound from "../errors/ObjectNotFound";
import CategoryAttribute from "../models/categoryAttribute";

class categoryAttributeHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = categoryAttribute.validate(body);

         if (value.error) throw new BadRequest(value.error.message);
         const brand = await CategoryAttribute.create(body);

         return myResponse(res, true, "add category attribute successful", 200, brand);
      } catch (error) {
         next(error);
      }
   }

   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = categoryAttribute.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await CategoryAttribute.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await CategoryAttribute.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(res, true, "update category attribute successful", 200, item);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await CategoryAttribute.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(res, true, "delete category attribute successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new categoryAttributeHandler();
