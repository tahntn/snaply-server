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
    id: Joi.string()
      .required()
      .messages({
        'any.required': req.t('friend.confirmFriend.id.required'),
      }),
  }),
});

export const getListFriendByUserIdValidate = (req: Request) => ({
  query: Joi.object().keys({
    limit: Joi.string(),
    page: Joi.string(),
    type: Joi.string()
      .valid('friends', 'friendRequests')
      .default('friends')
      .messages({
        'any.only': req.t('friend.getListFriend.type.enum'),
      }),
  }),
});
