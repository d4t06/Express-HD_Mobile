import { NextFunction, Request, Response } from "express";
import ObjectNotFound from "../errors/ObjectNotFound";
import BadRequest from "../errors/BadRequest";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import AccessDenied from "../errors/AccesDenie";
import myResponse from "../system/myResponse";
import Forbiden from "../errors/Forbiden";

export default function errorHandler(
   error: Error,
   _req: Request,
   res: Response,
   _next: NextFunction,
) {
   if (error instanceof ObjectNotFound) return myResponse(res, false, error.message, 404);

   if (error instanceof BadRequest) return myResponse(res, false, error.message, 400);

   if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError)
      return myResponse(res, false, error.message, 401);

   if (error instanceof AccessDenied) return myResponse(res, false, error.message, 403);

   if (error instanceof Forbiden) return myResponse(res, false, error.message, 403);

   console.log(error.message)

   return myResponse(res, false, error.message, 500);
}
