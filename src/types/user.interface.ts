/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Model } from 'mongoose';

export interface IUser {
  userName: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  role: boolean;
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

export type INewRegisteredUser = Pick<IUser, 'email' | 'password' | 'userName'>;

export interface IQueryUser {
  page?: string;
  limit?: string;
  q: string;
}
