import mongoose from 'mongoose';
// import tokenTypes from './token.types';
// import toJSON from '../toJSON/toJSON';
// import { ITokenDoc, ITokenModel } from './token.interfaces';
import { ITokenDoc, ITokenModel, tokenTypes } from '../types/token.interface';

const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Token = mongoose.model<ITokenDoc, ITokenModel>('Token', tokenSchema);

export default Token;
