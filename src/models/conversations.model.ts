import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Messages',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Conversations = mongoose.model('Conversations', ConversationSchema);
export default Conversations;
