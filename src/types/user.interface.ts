/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Model } from 'mongoose';

export interface IUser {
  userName: string;
  email: string;
  password: string;
  avatar: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  totalFollowers: number;
  totalFollowing: number;
  createdAt: Date;
  updatedAt: Date;
  role: boolean;
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

export type INewRegisteredUser = Pick<IUser, 'email' | 'password' | 'userName'>;
