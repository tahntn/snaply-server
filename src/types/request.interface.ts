import { Request } from 'express';
import { IUser } from '../models';

export interface IRequest extends Request {
  user: IUser;
}
