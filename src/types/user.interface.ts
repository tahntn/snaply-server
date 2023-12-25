import { IUser } from '../models/user.model';

export type INewRegisteredUser = Pick<IUser, 'email' | 'password' | 'userName'>;

export interface IQueryUser {
  page?: string;
  limit?: string;
  q: string;
}
