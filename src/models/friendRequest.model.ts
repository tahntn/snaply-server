import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;
