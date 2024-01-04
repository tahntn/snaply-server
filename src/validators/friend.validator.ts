import { Request } from 'express';

import Joi from 'joi';

export const createFriendRequestValidate = (req: Request) => ({
  body: Joi.object().keys({
    receiverEmail: Joi.string()
      .required()
      .messages({
        'any.required': req.t('friend.createFriend.receiverEmail.required'),
      }),
  }),
});

export const updateFriendRequestValidate = (req: Request) => ({
  params: Joi.object().keys({
    friendRequestId: Joi.string()
      .required()
      .messages({
        'any.required': req.t('friend.confirmFriend.friendRequestId.required'),
      }),
  }),
});
