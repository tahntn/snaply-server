import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  title: string;
  senderId: mongoose.Types.ObjectId;
  replyTo?: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  isPin?: boolean;
  type: 'text' | 'image' | 'video' | 'file' | 'update' | 'gif';
  imageList?: string[];
  url?: string;
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
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'update', 'gif'],
      default: 'text',
    },
    imageList: [
      {
        type: String,
      },
    ],
    url: {
      type: String,
    },
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
