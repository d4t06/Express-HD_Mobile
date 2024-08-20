import Joi from "joi";

const brandSchema = Joi.object({
   id: Joi.number(),
   name: Joi.string().required(),
   name_ascii: Joi.string().required(),
   category_id: Joi.number().required(),
   image_url: Joi.string().empty(""),
});

export default brandSchema;
