import { Request } from 'express';
import Joi from 'joi';

export const searchUserName = (req: Request) => ({
  query: Joi.object().keys({
    q: Joi.string()
      .required()
      .messages({
        'any.required': req.t('user.searchUser.keyword'),
      }),
    limit: Joi.string(),
    page: Joi.string(),
  }),
});
