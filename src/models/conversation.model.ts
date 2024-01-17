import mongoose, { Document, Schema } from 'mongoose';
import { IMessage } from './message.model';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup?: boolean;
  nameGroup?: string;
  avatarGroup?: string;
  lastActivity?: {
    lastMessage: IMessage;
  };
}
const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
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
      lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    },
  },
  { timestamps: true }
);

ConversationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
