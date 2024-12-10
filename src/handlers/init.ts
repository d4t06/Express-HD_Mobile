import { NextFunction, Request, Response } from "express";
// import bcrypt from "bcrypt";
import User from "../models/user";
import BadRequest from "../errors/BadRequest";
import Category from "../models/category";
import Slider from "../models/slider";
import CategorySlider from "../models/categorySlider";
import myResponse from "../system/myResponse";
import userSchema from "../schemas/user";
import Forbiden from "../errors/Forbiden";

class InitController {
   async init(req: Request, res: Response, next: NextFunction) {
      try {
         const user = req.body;

         const result = userSchema.validate(user);

         if (result.error) throw new BadRequest(result.error.message);

         const founded = await User.findOne({
            where: {
               username: "admin",
            },
         });

         if (founded) throw new Forbiden("");

         // const salt = await bcrypt.genSalt(10);
         // const hashPassword = await bcrypt.hash(user.password, salt);
         await User.create({
            password: user.password,
            username: "admin",
            role: "ADMIN",
         });

         const newCategory = await Category.create({
            name: "Home",
            name_ascii: "home",
            hidden: true,
            attribute_order: "",
         });

         const newSlider = await Slider.create({ name: "slider for home" });

         await CategorySlider.create({
            slider_id: newSlider.id,
            category_id: newCategory.id,
         });

         return myResponse(res, true, "Init successful", 200);
      } catch (error) {
         next(error);
      }
   }
}

export default new InitController();
