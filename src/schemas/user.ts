import Joi from "joi";

const userSchema = Joi.object({
   username: Joi.string().required(),
   password: Joi.string().required(),
});

export default userSchema;
