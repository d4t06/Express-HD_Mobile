import { NextFunction, Request, Response } from "express";
import ObjectNotFound from "../errors/ObjectNotFound";
import BadRequest from "../errors/BadRequest";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import AccessDenied from "../errors/AccesDenie";

export default function errorHandler(
   error: Error,
   _req: Request,
   res: Response,
   _next: NextFunction
) {
   if (error instanceof ObjectNotFound)
      return res.status(404).json({ flag: false, message: error.message, code: 404 });

   if (error instanceof BadRequest)
      return res.status(400).json({ flag: false, message: error.message, code: 400 });

   if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError)
      return res.status(401).json({ flag: false, message: error.message, code: 401 });

   if (error instanceof AccessDenied)
      return res.status(403).json({ flag: false, message: error.message, code: 403 });

   console.log(error);

   return res
      .status(500)
      .json({ flag: false, message: "Some things went wrong", code: 500 });
}
