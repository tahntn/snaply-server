import { Request } from 'express';
import Joi from 'joi';
import { objectId } from './custom.validator';

export const sendMessage = (req: Request) => ({
  body: Joi.object().keys({
    title: Joi.string()
      .required()
      .messages({
        'any.required': req.t('message.sendMessage.title'),
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
