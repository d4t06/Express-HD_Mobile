import { NextFunction, Request, Response } from "express";
import Rating from "../models/productRating";
import { countDateDiff } from "../system/helper";
import myResponse from "../system/myResponse";
import { InferAttributes, Sequelize, WhereOptions } from "sequelize";
import sequelize from "../config/sequelize";
import ratingSchema from "../schemas/rating";
import BadRequest from "../errors/BadRequest";

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
      req: Request<
         {},
         {},
         {},
         { page: string; product_id: string; size: string; approved: string }
      >,
      res: Response,
      next: NextFunction
   ) {
      try {
         const { page, product_id, size, approved } = req.query;

         const where: WhereOptions<InferAttributes<Rating>> = {};

         const _page = (typeof page === "string" && +page) || 1;
         const _size = (typeof size === "string" && +size < 12 && +size) || 12;
         const _productId = typeof product_id === "string" && +product_id;
         const _approved =
            typeof +approved === "number" && [0, 1].includes(+approved)
               ? +approved
               : 1;

         // apply  where condition
         where.approve = !!_approved;
         if (_productId) where.product_id = _productId;

         const { rows, count } = await Rating.findAndCountAll({
            offset: (_page - 1) * _size,
            limit: _size,
            where,
            order: [["id", "DESC"]],
         });

         if (rows.length) {
            rows.forEach((item) => {
               item["date_convert"] = countDateDiff(item["createdAt"]);
            });
         }

         const resData = {
            product_id: _productId,
            ratings: rows,
            page: _page,
            size: _size,
            approved: _approved,
            count,
         };

         return myResponse(
            res,
            true,
            "Get product rating successful",
            200,
            resData
         );
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

         const _productId =
            product_id && typeof product_id === "string" && +product_id;

         if (!_productId) throw new BadRequest("");

         const average = await Rating.findOne({
            attributes: [
               [Sequelize.fn("AVG", sequelize.col("rate")), "average"],
            ],
            where: { product_id: _productId, approve: 1 },
         });

         return myResponse(
            res,
            true,
            "Get rating average successful",
            200,
            average
         );
      } catch (error) {
         next(error);
      }
   }
}

export default new RatingHandler();
