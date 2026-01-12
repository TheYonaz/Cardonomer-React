const Joi = require("joi");

const registerValidation = (user) => {
  const schema = Joi.object({
    name: Joi.object()
      .keys({
        first: Joi.string().min(2).max(256).required(),
        middle: Joi.string().max(256).allow(""),
        last: Joi.string().min(2).max(256).required(),
      })
      .required(),

    phone: Joi.string()
      .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)

      .rule({ message: 'user "phone" must be a valid phone number' })
      .allow(""),
    email: Joi.string()
      .ruleset.pattern(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: 'user "mail" must be a valid mail' })
      .required(),
    password: Joi.string()
      .ruleset.regex(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
      )
      .rule({
        message:
          'user "password" must be at least nine characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-',
      })
      .required(),
    image: Joi.object()
      .keys({
        url: Joi.string()
          .ruleset.regex(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
          )
          .rule({ message: "user image must be a valid url" })
          .allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
      })
      .allow(""),
    address: Joi.object()
      .keys({
        state: Joi.string().allow(""),
        country: Joi.string().allow(""),
        city: Joi.string().allow(""),
        street: Joi.string().allow(""),
        houseNumber: Joi.number().allow(0),
        zip: Joi.number().allow(0),
      })
      .allow(""),
    isBusiness: Joi.boolean().allow(""),
    isAdmin: Joi.boolean().allow(""),
    likedPosts: Joi.array().items(Joi.string()).allow(""),
    decks: Joi.array().items(Joi.string()),
    publishedPosts: Joi.array().items(
      Joi.object().keys({
        post_id: Joi.string().required(),
        createdAt: Joi.date().required(),
        content: Joi.string().required(),
      })
    ),
  });
  return schema.validate(user);
};

module.exports = registerValidation;
