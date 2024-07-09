import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import ObjectNotFound from "../errors/ObjectNotFound";
import Image from "../models/image";

import cloudinary from "cloudinary";
import { generateId } from "../system/helper";

const PAGE_SIZE = 6;

cloudinary.v2.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET,
});

class priceRangeHandler {
   async findAll(req: Request, res: Response, next: NextFunction) {
      try {
         const { page, size } = req.query;

         const _size =
            (size && typeof size === "string" && +size < 12 && +size) || PAGE_SIZE;
         const _page = (page && typeof page === "string" && +page) || 1;

         const { rows, count } = await Image.findAndCountAll({
            offset: (+_page - 1) * _size,
            limit: _size,
            order: [["createdAt", "DESC"]],
         });

         return myResponse(res, true, "add image successful", 200, {
            images: rows,
            count,
            page: _page,
            page_size: _size,
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
