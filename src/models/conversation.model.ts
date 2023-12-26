import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
}

const ConversationSchema = new mongoose.Schema<IConversation>(
  {
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
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
