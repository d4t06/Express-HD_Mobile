import Joi from "joi";

const ratingSchema = Joi.object({
   id: Joi.number(),
   product_id: Joi.number().required(),
   username: Joi.string().required(),
   content: Joi.string().empty(""),
   rate: Joi.number().required(),
});

export default ratingSchema;
