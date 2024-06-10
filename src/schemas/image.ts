import Joi from "joi";

const imageSchema = Joi.object({
   id: Joi.number(),
   name: Joi.string().required(),
   image_url: Joi.string().required(),
   size: Joi.string().required(),
   public_id: Joi.string().required(),
});

export default imageSchema;
