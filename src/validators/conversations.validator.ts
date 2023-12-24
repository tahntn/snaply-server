import Joi from 'joi';

export const createConversation = {
  body: Joi.object().keys({
    participants: Joi.array().items(Joi.string()),
    messages: Joi.array().items(Joi.string()),
  }),
};

export const getConversations = {};
export const getConversation = {};
export const updateConversation = {};
export const deleteConversation = {};
