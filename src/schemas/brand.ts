import Joi from "joi";

const brandSchema = Joi.object({
   id: Joi.number(),
   brand: Joi.string().required(),
   brand_ascii: Joi.string().required(),
   category_id: Joi.number().required(),
   image_url: Joi.string().empty(""),
});

export default brandSchema;
