import mongoose, { Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup: boolean;
  nameGroup?: string;
  avatarGroup?: string;
}

const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    nameGroup: {
      type: String,
    },
    avatarGroup: {
      type: String,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
