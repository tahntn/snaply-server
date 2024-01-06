import mongoose, { Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup?: boolean;
  nameGroup?: string;
  avatarGroup?: string;
  lastActivity?: ILastActivity;
}
export interface ILastActivity {
  type: 'init' | 'message' | 'user_leave';
  content?: string;
  senderId: mongoose.Types.ObjectId;
  timestamp: Date;
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
    lastActivity: {
      type: {
        type: String,
        enum: ['init', 'message', 'user_leave'],
        default: 'init',
      },
      content: {
        type: String,
        default: '',
      },
      senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
      timestamp: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
