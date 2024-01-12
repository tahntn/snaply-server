import mongoose, { Document, Schema } from 'mongoose';

export interface IFriend extends Document {
  userId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  status: 'pending' | 'accept';
}

const FriendSchema = new mongoose.Schema<IFriend>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accept'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

FriendSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Friend = mongoose.model<IFriend>('Friend', FriendSchema);
export default Friend;
