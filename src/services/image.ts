import cloudinary from "cloudinary";
import { generateId } from "../system/helper";
import { Image } from "../models";

cloudinary.v2.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET,
});

class ImageService {
   async upload(data: string) {
      const res = await cloudinary.v2.uploader.upload(data, {
         resource_type: "auto",
         folder: "test",
      });

      const imageInfo = {
         name: generateId(res.original_filename),
         public_id: res.public_id,
         image_url: res.url,
         size: Math.ceil(res.bytes / 1024),
      };

      const newImage = await Image.create(imageInfo);

      return newImage;
   }
}

export default new ImageService();
