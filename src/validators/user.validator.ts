import { Request } from 'express';
import Joi from 'joi';
import { password } from './custom.validator';

export const searchUserName = (req: Request) => ({
  query: Joi.object().keys({
    q: Joi.string()
      .required()
      .messages({
        'any.required': req.t('user.searchUser.keyword'),
        'string.base': req.t('error.string'),
      }),
    limit: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
      'string.base': req.t('error.string'),
    }),
    page: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
      'string.base': req.t('error.string'),
    }),
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

export const changePassword = (req: Request) => ({
  body: Joi.object().keys({
    newPassword: Joi.string()
      .required()
      .custom((value, helper) => password(value, helper, req))
      .messages({
        'any.required': req.t('user.changePassword.newPasswordRequired'),
        'string.base': req.t('error.string'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
      }),
    oldPassword: Joi.string()
      .required()
      .custom((value, helper) => password(value, helper, req))
      .messages({
        'any.required': req.t('user.changePassword.oldPasswordRequired'),
        'string.base': req.t('error.string'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
      }),
  }),
});
