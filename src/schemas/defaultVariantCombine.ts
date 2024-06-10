import Joi from "joi";

const defaultVariantCombineSchema = Joi.object({
   id: Joi.number(),
   combine_id: Joi.number().required(),
   variant_id: Joi.number().required(),
});

export default defaultVariantCombineSchema;
