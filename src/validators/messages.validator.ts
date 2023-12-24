import Joi from 'joi';

export const sendMessage = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    senderId: Joi.string().required(),
    content: Joi.string().required(),
    receiverId: Joi.string().required(),
    conversationsId: Joi.string().required(),
  }),
};

export const getMessages = {};
export const getMessage = {};
export const updateMessage = {};
export const deleteMessage = {};
