import { NextFunction, Request, Response } from "express";
import { UserSchema } from "../types/type";
import userSchema from "../schemas/user";
import BadRequest from "../errors/BadRequest";
import User from "../models/user";
import myResponse from "../system/myResponse";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ObjectNotFound from "../errors/ObjectNotFound";

const ACCESS_TOKEN_EXPIRE = '1h'
const REFRESH_TOKEN_EXPIRE = '5d'

class AuthHandler {
   async login(
      req: Request<{}, {}, { username: string; password: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const body = req.body;
         const value = userSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);

         const user = await User.findOne({
            where: {
               username: body.username,
            },
         });

         if (!user)
            return myResponse(res, false, "username or password is not correct", 401);

         // const isCorrectPassword = await bcrypt.compare(body.password, user.password);
         const isCorrectPassword = (body.password === user.password);

         if (!isCorrectPassword)
            return myResponse(res, false, "username or password is not correct", 401);

         const token = jwt.sign(
            {
               username: user.username,
               role: user.role,
            },
            process.env.JWT_SECRET!,
            {
               expiresIn: ACCESS_TOKEN_EXPIRE,
            }
         );

         const refreshToken = jwt.sign(
            {
               username: user.username,
               role: user.role,
            },
            process.env.JWT_SECRET!,
            {
               expiresIn: REFRESH_TOKEN_EXPIRE,
            }
         );

         res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
         });

         return myResponse(res, true, "login successful", 200, {
            userInfo: {
               username: user.username,
               role: user.role,
            },
            token,
         });
      } catch (error) {
         next(error);
      }
   }

   async register(req: Request<{}, {}, UserSchema>, res: Response, next: NextFunction) {
      try {
         const body = req.body;
         const value = userSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);

         const user = await User.findOne({
            where: {
               username: body.username,
            },
            // raw: true, => then res = 'role_data.id' not role_data: {id: }
         });

         if (user) return myResponse(res, false, "username already exist", 409);

         // const salt = await bcrypt.genSalt(10);
         // const hashPassword = await bcrypt.hash(body.password, salt);

         await User.create({
            username: body.username,
            password: body.password,
            role: "USER",
         });

         return myResponse(res, true, "register ok", 200);
      } catch (error) {
         next(error);
      }
   }

   async logout(req: Request<{}, {}, UserSchema>, res: Response, next: NextFunction) {
      const cookies = req.cookies;
      if (!cookies.jwt) throw new BadRequest("cookie not provided");

      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
   }

   async refreshToken(req: Request, res: Response, next: NextFunction) {
      try {
         const cookies = req.cookies;

         if (!cookies.jwt) throw new BadRequest("cookie not provided");

         const decode = jwt.verify(cookies.jwt, process.env.JWT_SECRET!) as {
            username: string;
            role: string;
         };

         console.log("refresh check ", decode.role);

         const user = await User.findOne({
            where: { username: decode.username },
         });

         if (!user) throw new ObjectNotFound("");

         const newToken = jwt.sign(
            {
               username: decode.username,
               role: decode.role,
            },
            "nguyenhuudat",
            {
               expiresIn: ACCESS_TOKEN_EXPIRE,
            }
         );

         return myResponse(res, true, "login successful", 200, {
            userInfo: {
               username: decode.username,
               role: decode.role,
            },
            token: newToken,
         });
      } catch (error) {
         next(error);
      }
   }
}

export default new AuthHandler();
