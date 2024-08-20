import { NextFunction, Request, Response } from "express";
import { Sort } from "../types/type";
import { Filterable, InferAttributes, Op } from "sequelize";
import Product from "../models/product";
import myResponse from "../system/myResponse";

const PAGE_SIZE = 6;

interface Query {
   page: number;
   category_id: number;
   brand_id: string[];
   price: string[];
   size: string;
}

class ProductManagement {
   async findAll(req: Request<{}, {}, {}, Query>, res: Response, next: NextFunction) {
      try {
         const query = req.query;
         const { page, brand_id, category_id, price, size } = query;
         const sort = res.locals.sort as Sort;

         const _size =
            (size && typeof size === "string" && +size < 12 && +size) || PAGE_SIZE;
         const _page = (page && typeof page === "string" && +page) || 1;

         const where: Filterable<InferAttributes<Product, { omit: never }>>["where"] = {};

         if (category_id) where.category_id = category_id;

         if (brand_id) {
            where.brand_id = {
               [Op.in]: brand_id,
            };
         }

         const { count, rows } = await Product.findAndCountAll({
            offset: (_page - 1) * _size,
            limit: _size,
            distinct: true,
            where,
         });

         return myResponse(res, true, "get all product successful", 200, {
            products: rows,
            count,
            page: _page,
            size: _size,
            sort: sort.enable,
            category_id: +category_id || null,
            brand_id: brand_id?.length ? brand_id : null,
            column: sort.enable ? sort.column : null,
            type: sort.enable ? sort.type : null,
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new ProductManagement();
