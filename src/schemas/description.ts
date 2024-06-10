import Joi from "joi";

const descriptionSchema = Joi.object({
   id: Joi.number(),
   product_ascii: Joi.string().required(),
   content: Joi.string().required(),
});

export default descriptionSchema;
