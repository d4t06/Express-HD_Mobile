import Joi from "joi";

const descriptionSchema = Joi.object({
   id: Joi.number(),
   product_id: Joi.number().required(),
   content: Joi.string().required(),
});

export default descriptionSchema;
