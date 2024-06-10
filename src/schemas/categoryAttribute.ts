import Joi from "joi";

const categoryAttributeSchema = Joi.object({
   id: Joi.number(),
   attribute: Joi.string().required(),
   attribute_ascii: Joi.string().required(),
   category_id: Joi.number().required(),
});

export default categoryAttributeSchema;
