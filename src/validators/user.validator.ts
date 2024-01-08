import { Request } from 'express';
import Joi from 'joi';

export const searchUserName = (req: Request) => ({
  query: Joi.object().keys({
    q: Joi.string()
      .required()
      .messages({
        'any.required': req.t('user.searchUser.keyword'),
        'string.base': req.t('error.string'),
      }),
    limit: Joi.string(),
    page: Joi.string(),
  }),
});

export const updateUser = (req: Request) => ({
  body: Joi.object().keys({
    username: Joi.string().messages({
      'string.base': req.t('error.string'),
      'string.empty': req.t('error.cannotEnterEmptyString'),
    }),
    email: Joi.string()
      .email()
      .messages({
        'string.base': req.t('error.string'),
        'string.email': req.t('auth.email.email'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
      }),
    avatar: Joi.string()
      .uri()
      .messages({
        'string.base': req.t('error.string'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.uri': req.t('error.pleaseEnterUrl'),
      }),
  }),
});
