import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import brandSchema from "../schemas/brand";
import ObjectNotFound from "../errors/ObjectNotFound";
import Brand from "../models/brand"

import { generateId } from "../system/helper";

class BrandHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = brandSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);

         const founded = await Brand.findOne({
            where: {
               name_ascii: generateId(body.name),
               category_id: body.category_id,
            },
         });

         if (founded)
            return myResponse(res, false, "Brand already exist", 409);

         const brand = await Brand.create({ ...body, name_ascii: generateId(body.name) });

         return myResponse(res, true, "add brand successful", 200, brand);
      } catch (error) {
         next(error);
      }
   }

   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = brandSchema.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const founded = await Brand.findOne({
            where: {
               name_ascii: body.name_ascii,
            },
         });

         if (founded) return myResponse(res, false, "Category already exist", 409);

         const oldBrand = await Brand.findByPk(id);
         if (!oldBrand) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await Brand.update(body, { where: { id } });

         Object.assign(oldBrand, body);

         return myResponse(res, true, "update brand successful", 200, oldBrand);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         console.log("check id", id, +id);

         const brand = await Brand.findByPk(id);
         if (!brand) throw new ObjectNotFound("");

         brand.destroy({});

         return myResponse(res, true, "delete brand successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new BrandHandler();
