import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
}

const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
