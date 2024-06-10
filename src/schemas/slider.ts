import Joi from "joi";

const sliderSchema = Joi.object({
   id: Joi.number(),
   name: Joi.string().required(),
});

export default sliderSchema;
