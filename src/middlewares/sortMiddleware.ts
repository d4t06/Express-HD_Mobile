import { NextFunction, Request, Response } from "express";
import { Sort } from "../types/type";

export default function sortMiddleware(
   req: Request<{}, {}, {}, { column: string; type: "string" }> | any,
   res: Response,
   next: NextFunction
) {
   res.locals.sort = {
      column: "",
      enable: false,
      type: "ASC",
   } as Sort;

   // eliminate
   const { column, type = "ASC" } = req.query;

   if (column) {
      const isValidType = ["ASC", "DESC"].includes(type);
      const isValidColumn = ["price", "installment"].includes(column);

      Object.assign(res.locals.sort, {
         enable: isValidColumn && isValidType ? true : false,
         type,
         column,
      });
   } else {
      // không cần else ở đay bì, mỗi một request sẽ có res.locals.sort mới
   }

   next();
}
