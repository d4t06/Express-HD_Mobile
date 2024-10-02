import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";
import BadRequest from "../errors/BadRequest";
import ObjectNotFound from "../errors/ObjectNotFound";
import Image from "../models/image";
import CloudinaryService from "../services/cloudinary";

import cloudinary from "cloudinary";

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
            (size && typeof size === "string" && +size < 50 && +size) || PAGE_SIZE;
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

   async uploadFile(req: Request, res: Response, next: NextFunction) {
      try {
         const file = req.file;
         if (!file) throw new BadRequest("");

         const { buffer, mimetype } = file;

         const b64 = Buffer.from(buffer).toString("base64");
         let dataURI = "data:" + mimetype + ";base64," + b64;

         const newImage = await CloudinaryService.upload(dataURI);

         return myResponse(res, true, "Upload image successful", 200, newImage);
      } catch (error) {
         next(error);
      }
   }

   async uploadUrl(
      req: Request<{ imageUrl: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { imageUrl } = req.params;
         if (!imageUrl) throw new BadRequest("");

         const imageInfo = await CloudinaryService.upload(imageUrl);

         const newImage = await Image.create(imageInfo);

         return myResponse(res, true, "Upload image successful", 200, newImage);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         const item = await Image.findOne({
            where: {
               public_id: id,
            },
         });
         if (!item) throw new ObjectNotFound("");

         await CloudinaryService.delete(id);

         await item.destroy();

         return myResponse(res, true, "Delete image successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new priceRangeHandler();
