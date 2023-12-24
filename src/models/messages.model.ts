import mongoose from 'mongoose';

const MessagesSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  content: { type: String, required: true },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Messages',
  },
  conversationsId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversations',
  },
  isPin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  attachments: [
    {
      type: String,
    },
  ],
});

MessagesSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Messages = mongoose.model('Messages', MessagesSchema);
export default Messages;
