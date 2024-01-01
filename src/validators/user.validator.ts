import Joi from 'joi';

export const searchUserName = {
  query: Joi.object().keys({
    q: Joi.string().required(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
