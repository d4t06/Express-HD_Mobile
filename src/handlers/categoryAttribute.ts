import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import categoryAttribute from "../schemas/categoryAttribute";
import ObjectNotFound from "../errors/ObjectNotFound";
import CategoryAttribute from "../models/categoryAttribute";
import { generateId } from "../system/helper";

class categoryAttributeHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = categoryAttribute.validate(body);

         // check
         if (value.error) throw new BadRequest(value.error.message);
         const founded = await CategoryAttribute.findOne({
            where: {
               name_ascii: generateId(body.name),
               category_id: body.category_id
            },
         });

         if (founded)
            return myResponse(
               res,
               false,
               "Category attribute already exist",
               409
            );

         const brand = await CategoryAttribute.create({...body, name_ascii: generateId(body.name)});

         return myResponse(
            res,
            true,
            "add category attribute successful",
            200,
            brand
         );
      } catch (error) {
         next(error);
      }
   }

   async update(
      req: Request<{ id: number }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = categoryAttribute.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await CategoryAttribute.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         // check
         if (value.error) throw new BadRequest(value.error.message);

         const founded = await CategoryAttribute.findOne({
            where: {
               name_ascii: body.name_ascii,
            },
         });

         if (founded)
            return myResponse(
               res,
               false,
               "Category attribute already exist",
               409
            );

         await CategoryAttribute.update(body, { where: { id } });

         Object.assign(item, body);

         return myResponse(
            res,
            true,
            "update category attribute successful",
            200,
            item
         );
      } catch (error) {
         next(error);
      }
   }

   async delete(
      req: Request<{ id: number }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await CategoryAttribute.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(
            res,
            true,
            "delete category attribute successful",
            200
         );
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new categoryAttributeHandler();
