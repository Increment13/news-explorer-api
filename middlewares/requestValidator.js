/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');
const { UrlRegExp } = require('../config/config');

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(6)
      .regex(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
    password: Joi.string().required().min(6),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(6)
      .regex(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

const validateNewArticles = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri().pattern(UrlRegExp, 'URL'),
    image: Joi.string().required().uri().pattern(UrlRegExp, 'URL'),
  }),
});

module.exports = {
  validateLoginUser,
  validateCreateUser,
  validateId,
  validateNewArticles,
};
