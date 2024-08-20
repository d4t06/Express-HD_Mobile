import Joi from "joi";

const variantSchema = Joi.object({
   id: Joi.number(),
   product_id: Joi.number().required(),
   name: Joi.string().required(),
   name_ascii: Joi.string().required(),
});

export default variantSchema;
