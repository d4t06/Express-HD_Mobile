import { NextFunction, Request, Response } from "express";
import Rating from "../models/productRating";
import { convertDate } from "../system/helper";
import myResponse from "../system/myResponse";
import { Sequelize } from "sequelize";
import sequelize from "../config/sequelize";
import ratingSchema from "../schemas/rating";
import BadRequest from "../errors/BadRequest";

const PAGE_SIZE = 6;

class RatingHandler {
   async add(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;

         const value = ratingSchema.validate(body);
         if (value.error) throw new BadRequest(value.error.message);

         await Rating.create(body);

         return myResponse(res, true, "Rate successful", 200);
      } catch (err) {
         next(err);
      }
   }

   async getProductRating(
      req: Request<{}, {}, {}, { page: number; productId: number }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { page, productId } = req.query;

         const _page = (page && typeof page === "string" && +page) || 1;

         const _productId = productId && typeof productId === "string" && +productId;

         if (!_productId) {
            return myResponse(res, true, "Get product rating successful", 200, {
               product_id: productId,
               ratings: [],
               page: _page,
               page_size: PAGE_SIZE,
               count: 0,
            });
         }

         const { rows, count } = await Rating.findAndCountAll({
            offset: (_page - 1) * PAGE_SIZE,
            limit: PAGE_SIZE,
            where: { product_id: _productId },
         });

         if (rows.length) {
            rows.forEach((item) => {
               item["date_convert"] = convertDate(
                  item["createdAt"].toLocaleString(),
                  false
               );
            });
         }

         const resData = {
            product_id: _productId,
            ratings: rows,
            page: _page,
            page_size: PAGE_SIZE,
            count,
         };

         return myResponse(res, true, "Get product rating successful", 200, resData);
      } catch (error) {
         next(error);
      }
   }

   async getAverage(req: Request<{ productId: string }>, res: Response) {
      try {
         const { productId } = req.params;

         const average = await Rating.findOne({
            attributes: [[Sequelize.fn("AVG", sequelize.col("rate")), "average"]],
            where: { product_id: productId, approve: 1 },
         });

         return myResponse(res, true, "Get rating average successful", 200, average);
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: error });
      }
   }
}

export default new RatingHandler();
