import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import sliderImage from "../schemas/sliderImage";
import ObjectNotFound from "../errors/ObjectNotFound";
import SliderImage from "../models/sliderImage";

class sliderImageHandler {
   async add(req: Request<{}, {}, SliderImage[]>, res: Response, next: NextFunction) {
      try {
         const body = req.body;

         body.forEach((sI) => {
            const value = sliderImage.validate(sI);
            if (value.error) throw new BadRequest(value.error.message);
         });

         const sliderImages = await SliderImage.bulkCreate(body);

         return myResponse(res, true, "add slider image successful", 200, sliderImages);
      } catch (error) {
         next(error);
      }
   }

   async update(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         const body = req.body;
         const value = sliderImage.validate(body);

         if (Number.isNaN(+id)) throw new BadRequest("");

         const item = await SliderImage.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         if (value.error) throw new BadRequest(value.error.message);
         await SliderImage.update(body, { where: { id } });

         return myResponse(res, true, "update slider image successful", 200);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await SliderImage.findByPk(id);
         if (!item) throw new ObjectNotFound("");

         item.destroy();

         return myResponse(res, true, "delete slider image successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new sliderImageHandler();
