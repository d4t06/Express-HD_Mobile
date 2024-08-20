import Joi from "joi";

const productSchema = Joi.object({
   id: Joi.number(),
   name: Joi.string().required(),
   name_ascii: Joi.string().required(),
   image_url: Joi.string().empty(""),
   category_id: Joi.number().required(),
   brand_id: Joi.number().required(),
});

export default productSchema;
