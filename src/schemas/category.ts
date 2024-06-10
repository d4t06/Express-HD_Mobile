import Joi from "joi";

const categorySchema = Joi.object({
   id: Joi.number(),
   category: Joi.string().required(),
   category_ascii: Joi.string().required(),
   hidden: Joi.boolean(),
   attribute_order: Joi.string().empty(""),
});

export default categorySchema;
