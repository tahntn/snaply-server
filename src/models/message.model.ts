import mongoose, { Schema } from 'mongoose';

export interface IMessage extends Document {
  title: string;
  senderId: Schema.Types.ObjectId;
  replyTo?: Schema.Types.ObjectId;
  conversationsId: Schema.Types.ObjectId;
  isPin?: boolean;
  attachments?: string[];
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    title: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    replyTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
    },
    conversationsId: {
      type: mongoose.Schema.ObjectId,
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
