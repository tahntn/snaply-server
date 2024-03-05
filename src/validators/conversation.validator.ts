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
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
    isGroup: Joi.boolean().messages({
      'boolean.base': req.t('error.boolean').replace('#boolean', 'isGroup'),
    }),
    nameGroup: Joi.string().messages({
      'string.base': req.t('error.nameString'),
      'string.empty': req.t('error.cannotEnterEmptyString'),
    }),
    avatarGroup: Joi.string()
      .uri()
      .messages({
        'string.base': req.t('error.avatarString'),
        'string.uri': req.t('error.pleaseEnterUrl'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
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
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
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
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const typingMessage = (_req: Request) => ({
  body: Joi.object().keys({
    isTyping: Joi.boolean().required(),
  }),
});
