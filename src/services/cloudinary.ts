import cloudinary from "cloudinary";

cloudinary.v2.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_API_SECRET,
});

class ImageService {
   async upload(data: string) {
      const res = await cloudinary.v2.uploader.upload(data, {
         resource_type: "auto",
         folder: process.env.NODE_ENV === "development" ? "test" : "hd-mobile",
      });

      return res;
   }

   async delete(publicId: string) {
      await cloudinary.v2.uploader.destroy(publicId);
   }
}

export default new ImageService();
