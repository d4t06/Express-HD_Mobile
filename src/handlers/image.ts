import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import ObjectNotFound from "../errors/ObjectNotFound";
import Image from "../models/image";

import cloudinary from "cloudinary";
import { generateId } from "../system/helper";

const PAGE_SIZE = 18;

cloudinary.v2.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET,
});

console.log('check process', process.env.CLOUD_NAME);


class priceRangeHandler {
   async findAll(req: Request, res: Response, next: NextFunction) {
      try {
         const { page = 1 } = req.query;

         const { rows, count } = await Image.findAndCountAll({
            offset: (+page - 1) * PAGE_SIZE,
            limit: PAGE_SIZE,
            order: [["createdAt", "DESC"]],
         });

         return myResponse(res, true, "add image successful", 200, {
            images: rows,
            count,
         });
      } catch (error) {
         next(error);
      }
   }

   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const file = req.file;
         if (!file) throw new BadRequest("");

         const { buffer, mimetype, originalname, size } = file;

         const b64 = Buffer.from(buffer).toString("base64");
         let dataURI = "data:" + mimetype + ";base64," + b64;

         const imageUploadRes = await cloudinary.v2.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "hd-mobile-test",
         });

         const imageInfo = {
            name: generateId(originalname),
            public_id: imageUploadRes.public_id,
            image_url: imageUploadRes.url,
            size: Math.ceil(size / 1000),
         };

         const newImage = await Image.create(imageInfo);

         return myResponse(res, true, "add image successful", 200, newImage);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (Number.isNaN(+id)) throw new BadRequest("");
         const item = await Image.findByPk(id);
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
