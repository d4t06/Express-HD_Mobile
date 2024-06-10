import Joi from "joi";

const sliderImage = Joi.object({
   id: Joi.number(),
   slider_id: Joi.number().required(),
   image_id: Joi.number().required(),
   link_to: Joi.string().empty(""),
});

export default sliderImage;
