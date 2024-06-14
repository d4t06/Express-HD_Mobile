import Joi from "joi";

const cartItemSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   username: Joi.string().required(),
   color_id: Joi.number().required(),
   variant_id: Joi.number().required(),
   amount: Joi.number().required(),
});

export default cartItemSchema;
