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
    type: Joi.string()
      .valid('text', 'image', 'video', 'file')
      .default('text')
      .messages({
        'any.only': req.t('message.sendMessage.type.enum'),
      }),
    imageList: Joi.array().items(Joi.string().uri()).messages({
      'array.base': 'ImageList must be an array',
      'string.base': 'ImageList must contain only strings',
      'string.uri': 'ImageList must contain valid URIs',
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
