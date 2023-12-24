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
      ref: 'Message',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
