import Joi from "joi";

const colorSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   color_id: Joi.number().required(),
   variant_id: Joi.number().required(),
   price: Joi.number().required(),
   quantity: Joi.number().required(),
});

export default colorSchema;
