import Joi from "joi";

const EditUserSchema = {
  first: Joi.string().min(2).max(256).required(),
  middle: Joi.string().min(2).max(256).allow(""),
  last: Joi.string().min(2).max(256).required(),

  phone: Joi.string().min(9).max(11).required(),
  email: Joi.string()
    .ruleset.pattern(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    .rule({ message: 'user "email" mast be a valid mail' })
    .required(),
  url: Joi.string().min(14),
  alt: Joi.string().min(2).max(256),

  state: Joi.string().min(2).max(256).allow(""),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().min(2).max(256).required(),
  zip: Joi.number().min(2).max(256).required(),

  isBusiness: Joi.boolean(),
  user_id: Joi.string(),
};
export default EditUserSchema;
