import Joi from "joi";

const colorSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   color: Joi.string().required(),
   color_ascii: Joi.string().required(),
});

export default colorSchema;
