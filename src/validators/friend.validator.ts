import { Request } from 'express';

import Joi from 'joi';
import { objectId } from './custom.validator';

export const createFriendRequestValidate = (req: Request) => ({
  params: Joi.object().keys({
    userId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('error.objectId'),
      }),
  }),
});

export const updateFriendRequestValidate = (req: Request) => ({
  params: Joi.object().keys({
    id: Joi.string()
      .required()
      .messages({
        'any.required': req.t('friend.confirmFriend.id.required'),
      }),
  }),
});
