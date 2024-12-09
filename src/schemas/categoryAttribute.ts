import Joi from "joi";

const categoryAttributeSchema = Joi.object({
   id: Joi.number(),
   name: Joi.string().required(),
   name_ascii: Joi.string().empty(""),
   category_id: Joi.number().required(),
});

export default categoryAttributeSchema;
