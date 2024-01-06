import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
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
