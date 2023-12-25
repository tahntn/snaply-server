import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const Friend = mongoose.model('Friend', FriendSchema);
export default Friend;
