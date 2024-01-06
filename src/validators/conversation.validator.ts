import Joi from 'joi';

export const createConversation = {
  body: Joi.object().keys({
    participants: Joi.array().items(Joi.string()),
  }),
};
