import { IUser } from '../models/user.model';
import { AccessAndRefreshTokens } from './token.interface';

export type INewRegisteredUser = Pick<IUser, 'email' | 'password' | 'userName'>;

export interface IUserWithTokens {
  user: IUser;
  tokens: AccessAndRefreshTokens;
}
export interface IQueryUser {
  page?: string;
  limit?: string;
  q: string;
}
