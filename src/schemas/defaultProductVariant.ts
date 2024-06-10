import Joi from "joi";

const defaultVariantCombineSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   variant_id: Joi.number().required(),
});

export default defaultVariantCombineSchema;
