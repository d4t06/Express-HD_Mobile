import { NextFunction, Request, Response } from "express";
import BadRequest from "../errors/BadRequest";
import Rating from "../models/productRating";
import myResponse from "../system/myResponse";
import { countDateDiff } from "../system/helper";
import { Op } from "sequelize";

const SIZE = 6;

class RatingManagementHandler {
   //   async findAll(
   //     req: Request<{}, {}, {}, { page: number; size: number }>,
   //     res: Response,
   //     next: NextFunction
   //   ) {
   //     try {
   //       const { page, size } = req.query;

   //       const _page = (page && typeof page === "string" && +page) || 1;
   //       const _size = (size && typeof size === "string" && +size) || SIZE;

   //       const { rows, count } = await Rating.findAndCountAll({
   //         offset: (_page - 1) * _size,
   //         limit: _size,
   //         order: [["id", "DESC"]],
   //       });

   //       if (rows.length) {
   //         rows.forEach((item) => {
   //           item["date_convert"] = countDateDiff(item["createdAt"]);
   //         });
   //       }

   //       const resData = {
   //         ratings: rows,
   //         page: _page,
   //         size: _size,
   //         count,
   //       };

   //       return myResponse(res, true, "Get ratings successful", 200, resData);
   //     } catch (error) {
   //       next(error);
   //     }
   //   }

   async approve(req: Request, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const idList = body.id_list;

         await Rating.update(
            { approve: 1 },
            {
               where: {
                  id: {
                     [Op.in]: idList,
                  },
               },
            }
         );

         return myResponse(res, true, "Approve rating successful", 200);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         if (!id || typeof id !== "string" || isNaN(+id)) throw new BadRequest("");

         await Rating.destroy({ where: { id } });

         return myResponse(res, true, "Delete rating successful", 200);
      } catch (error) {
         next(error);
      }
   }
}

export default new RatingManagementHandler();
