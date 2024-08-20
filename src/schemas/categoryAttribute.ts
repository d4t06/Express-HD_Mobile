import Joi from "joi";

const categoryAttributeSchema = Joi.object({
   id: Joi.number(),
   name: Joi.string().required(),
   name_ascii: Joi.string().required(),
   category_id: Joi.number().required(),
});

export default categoryAttributeSchema;
