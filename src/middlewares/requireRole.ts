import { NextFunction, Request, Response } from "express";
import myResponse from "../system/myResponse";

const jwt = require("jsonwebtoken");

export default function requireRole(requireRole: "ADMIN" | "") {
   return async function (req: Request | any, res: Response, next: NextFunction) {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith("Bearer "))
         return myResponse(res, false, "Unauthorized", 401);

      const token = auth.split(" ")[1];

      try {
         const decode = jwt.verify(token, "nguyenhuudat") as {
            username: string;
            role: string;
         };

         console.log("role middleware check: ", decode.role);

         if (!decode.role.includes(requireRole))
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
