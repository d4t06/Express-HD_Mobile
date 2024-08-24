import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";

export default function requireRole(requireRole: "ADMIN" | "") {
   return async function (
      req: Request | any,
      res: Response,
      next: NextFunction
   ) {
      try {
         console.log(">>> inside require role, ", res.locals.user);

         if (!res.locals.user.role.includes(requireRole))
            return myResponse(
               res,
               false,
               "Insufficient privilege or the access token provided is expired, revoked",
               403
            );

         next();
      } catch (error) {

         return myResponse(
            res,
            false,
            "The access token provided is expired, revoked, malformed or invalid for other reasons",
            401
         );
      }
   };
}
