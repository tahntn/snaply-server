import { Request } from 'express';
import { TFunction } from 'i18next';
import mongoose from 'mongoose';
import { IUser } from '../models';

export interface ICheckFriend {
  userId1: mongoose.Types.ObjectId;
  userId2: mongoose.Types.ObjectId;
}

export interface ICreateFriendRequest {
  t: TFunction<'translation', undefined>;
  receiverUserId: mongoose.Types.ObjectId;
  currentUser: IUser;
}

export interface IUpdateStateFriendRequest {
  t: TFunction<'translation', undefined>;
  friendRequestId: mongoose.Types.ObjectId;
  currentUser: IUser;
}
