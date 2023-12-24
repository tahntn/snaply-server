import mongoose from 'mongoose';
import { IUser, IUserModel } from '../types';

const UserSchema = new mongoose.Schema<IUser, IUserModel>({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: Boolean,
    default: false,
  },
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default User;
