import Joi from "joi";

const variantSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   variant: Joi.string().required(),
   variant_ascii: Joi.string().required(),
});

export default variantSchema;
