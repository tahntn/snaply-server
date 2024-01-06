import { Request } from 'express';
import mongoose from 'mongoose';

export interface ICheckFriend {
  userId1: mongoose.Types.ObjectId;
  userId2: mongoose.Types.ObjectId;
}

export interface ICreateFriendRequest {
  req: Request;
  receiverUserId: mongoose.Types.ObjectId;
}

export interface IUpdateStateFriendRequest {
  req: Request;
  friendRequestId: mongoose.Types.ObjectId;
}
