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
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
  }),
});

export const updateFriendRequestValidate = (req: Request) => ({
  params: Joi.object().keys({
    friendRequestId: Joi.string()
      .custom((value, helper) => objectId(value, helper, req))
      .required()
      .messages({
        'any.required': req.t('friend.confirmFriend.id.required'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
  }),
});

export const getListFriendByUserIdValidate = (req: Request) => ({
  query: Joi.object().keys({
    limit: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
      'string.base': req.t('error.string'),
    }),
    page: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
      'string.base': req.t('error.string'),
    }),
    type: Joi.string()
      .valid('friends', 'friendRequests')
      .default('friends')
      .messages({
        'any.only': req.t('friend.getListFriend.type.enum'),
        'string.empty': req.t('error.cannotEnterEmptyString'),
        'string.base': req.t('error.string'),
      }),
  }),
});

export const getListFriendSortByAlphabetValidate = (req: Request) => ({
  query: Joi.object().keys({
    q: Joi.string(),
    limit: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
      'string.base': req.t('error.string'),
    }),
    page: Joi.string().messages({
      'string.empty': req.t('error.cannotEnterEmptyString'),
      'string.base': req.t('error.string'),
    }),
  }),
});
