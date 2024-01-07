import { Request } from 'express';
import Joi from 'joi';
import { objectId } from './custom.validator';

export const createConversation = (req: Request) => ({
  body: Joi.object().keys({
    participants: Joi.array()
      .items(Joi.string().custom((value, helper) => objectId(value, helper, req)))
      .required()
      .messages({
        'any.required': req.t('conversation.createConversation.required'),
      }),
    isGroup: Joi.boolean().messages({
      'boolean.base': req.t('error.boolean').replace('#boolean', 'isGroup'),
    }),
    nameGroup: Joi.string().messages({
      'string.base': req.t('error.nameString'),
    }),
    avatarGroup: Joi.string().messages({
      'string.base': req.t('error.avatarString'),
    }),
  }),
});

export const getDetailConversation = (req: Request) => ({
  params: Joi.object().keys({
    conversationId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('message.getListMessageByConversationId.conversationId'),
      }),
  }),
});

export const updateGroupConversation = (req: Request) => ({
  params: Joi.object().keys({
    conversationId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('message.getListMessageByConversationId.conversationId'),
      }),
  }),
  body: Joi.object().keys({
    nameGroup: Joi.string().messages({
      'string.base': req.t('error.string'),
      'string.empty': req.t('error.cannotEnterEmptyString'),
    }),
    avatarGroup: Joi.string()
      .uri()
      .messages({
        'string.base': req.t('error.string'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.uri': req.t('error.pleaseEnterUrl'),
      }),
  }),
});
