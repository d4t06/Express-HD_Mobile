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
      req: Request<{}, {}, {}, { page: string; productId: string; size: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { page, productId, size } = req.query;

         const _page = (page && typeof page === "string" && +page) || 1;
         const _size = (size && typeof size === "string" && +size < 12 && +size) || 1;

         const _productId = productId && typeof productId === "string" && +productId;

         if (!_productId) {
            return myResponse(res, true, "Get product rating successful", 200, {
               product_id: productId,
               ratings: [],
               page: _page,
               size: _size,
               count: 0,
            });
         }

         const { rows, count } = await Rating.findAndCountAll({
            offset: (_page - 1) * _size,
            limit: _size,
            where: { product_id: _productId, approve: 1 },
            order: [["id", "DESC"]],
         });

         if (rows.length) {
            rows.forEach((item) => {
               item["date_convert"] = convertDate(item["createdAt"].toString(), false);
            });
         }

         const resData = {
            product_id: _productId,
            ratings: rows,
            page: _page,
            size: _size,
            count,
         };

         return myResponse(res, true, "Get product rating successful", 200, resData);
      } catch (error) {
         next(error);
      }
   }

   async getAverage(
      req: Request<{}, {}, {}, { product_id: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { product_id } = req.query;

         const _productId = product_id && typeof product_id === "string" && +product_id;

         if (!_productId) throw new BadRequest("");

         const average = await Rating.findOne({
            attributes: [[Sequelize.fn("AVG", sequelize.col("rate")), "average"]],
            where: { product_id: _productId, approve: 1 },
         });

         return myResponse(res, true, "Get rating average successful", 200, average);
      } catch (error) {
         next(error);
      }
   }
}

export default new RatingHandler();
