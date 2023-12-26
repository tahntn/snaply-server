import mongoose, { Document } from 'mongoose';
import { roles } from '../constant';

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  // _id: mongoose.Schema.Types.ObjectId;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
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
