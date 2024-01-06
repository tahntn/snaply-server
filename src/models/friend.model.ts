import mongoose, { Schema } from 'mongoose';

const FriendSchema = new mongoose.Schema(
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

const Friend = mongoose.model('Friend', FriendSchema);
export default Friend;
