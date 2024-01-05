import { Request } from 'express';
import { CustomHelpers } from 'joi';

export const objectId = (value: string, helpers: CustomHelpers, req: Request) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: req.t('error.objectId') });
  }
  return value;
};

export const password = (value: string, helpers: CustomHelpers, req: Request) => {
  if (value.length < 4) {
    return helpers.message({ custom: req.t('auth.password.min') });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({ custom: req.t('auth.password.match') });
  }
  return value;
};

export const username = (value: string, helpers: CustomHelpers, req: Request) => {
  if (value.length < 4) {
    return helpers.message({ custom: req.t('auth.username.min') });
  }

  return value;
};
