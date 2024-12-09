import { NextFunction, Request, Response } from "express";
import { Sort } from "../types/type";
import { Filterable, FindOptions, InferAttributes, Op } from "sequelize";
import myResponse from "../system/myResponse";
import Product from "../models/product";
import BadRequest from "../errors/BadRequest";
import ProductManagementService from "../services/productManagement";
import { generateId } from "../system/helper";

interface Query {
   page: number;
   category_id: number;
   price: string[];
   size: string;
}

class ProductManagement {
   async findAll(req: Request<{}, {}, {}, Query>, res: Response, next: NextFunction) {
      try {
         const query = req.query;
         const { page, category_id, size } = query;
         const sort = res.locals.sort as Sort;

         const _size = (size && typeof size === "string" && +size <= 50 && +size) || 50;
         const _page = (page && typeof page === "string" && +page) || 1;

         const where: Filterable<InferAttributes<Product, { omit: never }>>["where"] = {};
         const order: FindOptions<InferAttributes<Product, { omit: never }>>["order"] = [
            ["id", "DESC"],
         ];

         if (category_id) where.category_id = category_id;

         const { count, rows } = await Product.findAndCountAll({
            offset: (_page - 1) * _size,
            limit: _size,
            distinct: true,
            where,
            order,
         });

         return myResponse(res, true, "get all product successful", 200, {
            products: rows,
            count,
            page: _page,
            size: _size,
            sort: sort.enable,
            category_id: +category_id || null,
            column: sort.enable ? sort.column : null,
            type: sort.enable ? sort.type : null,
         });
      } catch (error) {
         next(error);
      }
   }

   async duplicate(req: Request<{ id: string }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         if (isNaN(+id)) throw new BadRequest("");
         const newProduct = await ProductManagementService.duplicate(+id);

         return myResponse(res, true, "Duplicate product successful", 200, newProduct);
      } catch (error) {
         next(error);
      }
   }

   async JSONImport(req: Request<{}, { data: any }>, res: Response, next: NextFunction) {
      try {
         const { data } = req.body;
         if (!data) throw new BadRequest("");

         const product = await ProductManagementService.jsonImporter(data);

         return myResponse(res, true, "JSON import successful", 200, product);
      } catch (error) {
         next(error);
      }
   }

   async search(
      req: Request<{}, {}, {}, { q: string }>,
      res: Response,
      next: NextFunction,
   ) {
      try {
         const { q } = req.query;

         const { count, rows } = await Product.findAndCountAll({
            distinct: true,
            where: {
               name_ascii: { [Op.like]: `%${generateId(q)}%` },
            },
         });

         return myResponse(res, true, "search product successful", 200, {
            products: rows,
            count,
         });
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

export default new ProductManagement();
