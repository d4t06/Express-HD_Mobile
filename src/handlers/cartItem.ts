import { NextFunction, Request, Response } from "express";
import CartItem from "../models/cartItem";
import Combine from "../models/combine";
import myResponse from "../system/myResponse";
import cartItemSchema from "../schemas/cartItem";
import BadRequest from "../errors/BadRequest";
import ObjectNotFound from "../errors/ObjectNotFound";
import AccessDenied from "../errors/AccesDenie";
import Product from "../models/product";

type ResponseCartItem = {
   item: CartItem;
   price: number;
};

class cartItemHandler {
   async findAll(req: Request<{ username: string }>, res: Response, next: NextFunction) {
      try {
         const { username } = req.params;

         const cartItem = await CartItem.findAll({
            where: {
               username,
            },

            include: [
               {
                  model: Product,
                  as: "product",
                  include: [Product.associations.variants, Product.associations.colors],
               },
            ],
         });

         const data: ResponseCartItem[] = [];

         for await (let item of cartItem) {
            const combine = await Combine.findOne({
               where: {
                  variant_id: item.variant_id,
                  color_id: item.color_id,
               },
            });

            if (combine) {
               data.push({ item, price: combine.price });
            }
         }

         return myResponse(res, true, "get all cart item successful", 200, data);
      } catch (error) {
         next(error);
      }
   }

   async add(
      req: Request<{}, {}, CartItem, { tokenUsername: string }>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const body = req.body;
         const value = cartItemSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);

         if (body.username !== res.locals.tokenUsername) throw new AccessDenied("");

         const foundedCartItem = await CartItem.findOne({
            where: {
               username: body.username,
               product_id: body.product_id,
               variant_id: body.variant_id,
               color_id: body.color_id,
            },
         });

         if (foundedCartItem)
            return myResponse(res, true, "add cart item successful", 200);

         await CartItem.create(body);

         return myResponse(res, true, "add cart item successful", 200);
      } catch (error) {
         next(error);
      }
   }

   async update(
      req: Request<{ id: number }, {}, CartItem>,
      res: Response,
      next: NextFunction
   ) {
      try {
         const body = req.body;
         const value = cartItemSchema.validate(body);

         if (value.error) throw new BadRequest(value.error.message);

         const combine = await Combine.findOne({
            where: {
               color_id: body.color_id,
               variant_id: body.variant_id,
            },
         });

         if (!combine) throw new ObjectNotFound("");

         await CartItem.update(body, {
            where: {
               id: req.params.id,
            },
         });

         return myResponse(res, true, "update cart item successful", 200, combine.price);
      } catch (error) {
         next(error);
      }
   }

   async delete(req: Request<{ id: number }>, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;

         const brand = await CartItem.findByPk(id);
         if (!brand) throw new ObjectNotFound("");

         brand.destroy();

         return myResponse(res, true, "delete cart item successful", 200);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}
export default new cartItemHandler();
