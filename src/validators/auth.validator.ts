import Joi from 'joi';

export const validateLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};


export const validateRegister  = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userName: Joi.string().required()
  })
}
