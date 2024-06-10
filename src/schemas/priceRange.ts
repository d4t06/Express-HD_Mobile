import Joi from "joi";

const priceRangeSchema = Joi.object({
   id: Joi.number(),
   category_id: Joi.number().required(),
   label: Joi.string().required(),
   from: Joi.number().required(),
   to: Joi.number().required(),
});

export default priceRangeSchema;
