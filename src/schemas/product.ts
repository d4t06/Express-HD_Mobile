import Joi from "joi";

const productSchema = Joi.object({
   product_ascii: Joi.string().required(),
   product: Joi.string().required(),
   image_url: Joi.string().empty(""),
   category_id: Joi.number().required(),
   brand_id: Joi.number().required(),
});

export default productSchema;
