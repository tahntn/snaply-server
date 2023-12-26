import { Request } from 'express';
import { IUser } from '../models';
import { IObject } from './object.interface';

export interface IRequest extends Request {
  user: IUser;
  locale: string;
  language: IObject;
}
