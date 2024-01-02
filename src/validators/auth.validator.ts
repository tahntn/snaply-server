import Joi from 'joi';
import { Request } from 'express';

import { password, username } from './custom.validator';

export const validateLogin = (req: Request) => ({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({
        'any.required': req.t('auth.email.required'),
        'string.email': req.t('auth.email.email'),
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': req.t('auth.password.required'),
      }),
  }),
});

export const validateRegister = (req: Request) => ({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({
        'any.required': req.t('auth.email.required'),
        'string.email': req.t('auth.email.email'),
      }),
    password: Joi.string()
      .required()
      .custom((value, helper) => password(value, helper, req))
      .messages({
        'any.required': req.t('auth.password.required'),
      }),
    username: Joi.string()
      .required()
      .custom((value, helper) => username(value, helper, req))
      .messages({
        'any.required': req.t('auth.username.required'),
      }),
  }),
});

export const validateLogout = (req: Request) => ({
  body: Joi.object().keys({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': req.t('auth.refreshToken.required'),
      }),
  }),
});

export const validateRefreshTokens = (req: Request) => ({
  body: Joi.object().keys({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': req.t('auth.refreshToken.required'),
      }),
  }),
});
