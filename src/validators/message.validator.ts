import { Request } from 'express';
import Joi from 'joi';
import { objectId } from './custom.validator';

export const sendMessageValidate = (req: Request) => ({
  body: Joi.object().keys({
    title: Joi.string().messages({
      'string.base': req.t('error.string'),
      'string.empty': req.t('error.cannotEnterEmptyString'),
    }),
    type: Joi.string()
      .valid('text', 'image', 'video', 'file', 'update', 'gif')
      .default('text')
      .messages({
        'any.only': req.t('message.sendMessage.type.enum'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
      }),
    imageList: Joi.array()
      .items(Joi.string().uri())
      .messages({
        'array.base': req.t('message.sendMessage.imageList.array'),
        'string.base': req.t('message.sendMessage.imageList.string'),
        'string.uri': req.t('message.sendMessage.imageList.uri'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
      }),
    replyTo: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .messages({
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
    url: Joi.string()
      .uri()
      .messages({
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
        'string.uri': req.t('error.pleaseEnterUrl'),
      }),
  }),
  params: Joi.object().keys({
    conversationId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('message.sendMessage.conversationId'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
  }),
});

export const getListMessageByConversationIdValidate = (req: Request) => ({
  query: Joi.object().keys({
    limit: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
    }),
    page: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
    }),
  }),
  params: Joi.object().keys({
    conversationId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('message.getListMessageByConversationId.conversationId'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
  }),
});
