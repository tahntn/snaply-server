import mongoose, { Document } from 'mongoose';
import { roles } from '../constant';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  defaultAvatar: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      // required: true,
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
    defaultAvatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
