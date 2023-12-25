import Joi from 'joi';
import { INewRegisteredUser } from '../types';
import { password } from './custom.validator';

export const validateLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerBody: Record<keyof INewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  userName: Joi.string().required(),
};

export const validateRegister = {
  body: Joi.object().keys(registerBody),
};

export const validateLogout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const validateRefreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
