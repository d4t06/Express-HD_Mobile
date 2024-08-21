import { Express } from "express";
import myResponse from "../system/myResponse";

import categoryRouter from "./category";
import brandRouter from "./brand";
import categoryAttributeRouter from "./categoryAttribute";
import priceRangeRouter from "./priceRange";
import sliderImageRouter from "./sliderImage";
import productRouter from "./product";
import variantRouter from "./variant";
import colorRouter from "./color";
import combineRouter from "./combine";
import descriptionRouter from "./description";
import productAttributeRouter from "./productAttribute";
import defaultVariantCombineRouter from "./defaultVariantCombine";
import defaultProductVariantRouter from "./defaultProductVariant";
import authRouter from "./auth";
import imageRouter from "./image";
import initRouter from "./init";
import cartRouter from "./cartItem";
import productManagementRouter from "./productManagement";
import ratingRouter from "./rating";
import ratingManagementRouter from "./ratingManagement";

export default function routeHandler(app: Express) {
   app.use("/api/init", initRouter);

   app.use("/api/auth", authRouter);

   app.use("/api/cart-items", cartRouter);

   app.use("/api/images", imageRouter);

   app.use("/api/categories", categoryRouter);

   app.use("/api/category-brands", brandRouter);

   app.use("/api/category-attributes", categoryAttributeRouter);

   app.use("/api/category-price-ranges", priceRangeRouter);

   app.use("/api/slider-images", sliderImageRouter);

   app.use("/api/products", productRouter);

   app.use("/api/product-management", productManagementRouter);

   app.use("/api/product-variants", variantRouter);

   app.use("/api/product-colors", colorRouter);

   app.use("/api/product-combines", combineRouter);

   app.use("/api/product-descriptions", descriptionRouter);

   app.use("/api/product-attributes", productAttributeRouter);

   app.use("/api/default-variant-combines", defaultVariantCombineRouter);

   app.use("/api/default-product-variants", defaultProductVariantRouter);

   app.use("/api/product-ratings", ratingRouter);

   app.use("/api/product-rating-management", ratingManagementRouter);

   // app.use("/reviews", reviewRouter);

   // app.use("/orders", orderRouter);

   // app.use("/order-management", manageOrderRouter);

   // app.use(tokenMiddleware);

   // app.use("/carts", cartRouter);

   // app.use(roleMiddleware.isAdmin);

   // app.use("/category-management", manageCategoryRouter);

   // app.use("/slider-management", manageSlider);

   // app.use("/product-management", manageProductRouter);

   // app.use("/comment-management", manageCommentRouter);

   // app.use("/image-management", manageImageRouter);

   // app.use("/users", userRouter);

   // app.use("/review-management", manageReviewRouter);

   app.use("/", (req, res) => {
      return myResponse(res, false, "Resource not found", 404);
   });
}
