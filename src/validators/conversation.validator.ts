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
