/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { httpStatus } from '../constant';
import { pick } from '../utils';
import { ApiError } from '../errors';

const validate =
  (schema: any) =>
  (req: Request, _res: Response, _next?: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' } })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      throw new ApiError(httpStatus.BAD_REQUEST, errorMessage);
    }
    // Object.assign(req, value);
  };

export default validate;
