import mongoose, { Schema } from 'mongoose';

export interface IMessage extends Document {
  title: string;
  senderId: mongoose.Types.ObjectId;
  replyTo?: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  isPin?: boolean;
  attachments?: string[];
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    title: {
      type: String,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    isPin: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

MessageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
