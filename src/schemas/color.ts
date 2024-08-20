import Joi from "joi";

const colorSchema = Joi.object({
   id: Joi.number(),
   product_id: Joi.number().required(),
   name: Joi.string().required(),
   name_ascii: Joi.string().required(),
});

export default colorSchema;
