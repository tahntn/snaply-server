import { Request } from 'express';
import Joi from 'joi';
import { objectId } from './custom.validator';

export const sendMessageValidate = (req: Request) => ({
  body: Joi.object().keys({
    title: Joi.string()
      .required()
      .messages({
        'any.required': req.t('message.sendMessage.title'),
        'string.base': req.t('error.string'),
      }),
  }),
  params: Joi.object().keys({
    conversationId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('message.sendMessage.conversationId'),
      }),
  }),
});

export const getListMessageByConversationIdValidate = (req: Request) => ({
  query: Joi.object().keys({
    limit: Joi.string(),
    page: Joi.string(),
  }),
  params: Joi.object().keys({
    conversationId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('message.getListMessageByConversationId.conversationId'),
      }),
  }),
});
