import { Request } from 'express';
import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { Conversation, IConversation, IUser, Message } from '../models';
import { TPayloadSendMessage } from '../types';
import { areIdsEqual, parseNumber } from '../utils';
import mongoose from 'mongoose';
import { TFunction } from 'i18next';
import { checkExistence } from './common.service';

export const checkUserInConversation = (
  conversation: IConversation,
  currentUserId: mongoose.Types.ObjectId,
  t: TFunction<'translation', undefined>
) => {
  const isAuth = conversation?.participants.find((item) => areIdsEqual(currentUserId, item));
  if (!isAuth) {
    throw new ApiError(httpStatus.UNAUTHORIZED, t('conversation.error.accesscConversation'));
  }
  return true;
};

export const checkMessageInConversation = (
  conversationId: mongoose.Types.ObjectId,
  conversationMessageId: mongoose.Types.ObjectId,
  t: TFunction<'translation', undefined>
) => {
  const checkMessageInConversation = areIdsEqual(conversationId, conversationMessageId);

  if (!checkMessageInConversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, t('message.error.messageNotBelongToConversation'));
  }
  return true;
};

export const sendMessageService = async (payload: TPayloadSendMessage, req: Request) => {
  try {
    const { user, conversationId, title, type = 'text', imageList = [], replyTo } = payload;
    const currentUserId = user?._id;

    if (type === 'image') {
      if (!imageList?.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, req.t('message.error.imageRequired'));
      }
    }
    //check conversation exist
    const conversation = await checkExistence(
      Conversation,
      conversationId,
      req.t('conversation.error.conversationDoesNotExist')
    );

    // check user is in conversation
    checkUserInConversation(conversation!, currentUserId, req.t);

    // update last active
    await Conversation.updateOne(
      {
        _id: conversation?._id,
      },
      {
        $set: {
          lastActivity: {
            type,
            senderId: currentUserId,
            timestamp: new Date(),
          },
        },
      }
    );

    if (replyTo) {
      //check existing messages
      const message = await checkExistence(
        Message,
        replyTo,
        req.t('message.error.messageNotExist')
      );

      //check message in converation
      checkMessageInConversation(conversationId, message!.conversationId, req.t);

      // create new message
      const newMessage = await Message.create({
        title: type === 'text' ? title : '',
        senderId: currentUserId,
        conversationId,
        type,
        imageList: type === 'image' ? imageList : [],
        replyTo: replyTo,
      });
      return { messages: newMessage };
    }

    // create new message
    const newMessage = await Message.create({
      title: type === 'text' ? title : '',
      senderId: currentUserId,
      conversationId,
      type,
      imageList: type === 'image' ? imageList : [],
    });

    return newMessage;
  } catch (error) {
    handleError(error);
  }
};

export const getListMessageByConversationIdService = async (payload: {
  user: IUser;
  conversationId: mongoose.Types.ObjectId;
  page?: string;
  limit?: string;
  req: Request;
}) => {
  try {
    const { user, conversationId, page, limit, req } = payload;

    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);
    const startIndex = (_page - 1) * _limit;
    const currentUserId = user?._id;

    //check existing conversation
    const conversation = await checkExistence(
      Conversation,
      conversationId,
      req.t('conversation.error.conversationDoesNotExist')
    );

    //check user in conversation
    checkUserInConversation(conversation!, currentUserId, req.t);

    const messages = await Message.find({ conversationId: conversationId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .populate('senderId', '-role -password -createdAt -updatedAt')
      .populate('replyTo')
      .exec();

    return messages;
  } catch (error) {
    handleError(error);
  }
};

export const pinMessageService = async (payload: {
  currentUser: IUser;
  conversationId: mongoose.Types.ObjectId;
  messageId: mongoose.Types.ObjectId;
  t: TFunction<'translation', undefined>;
}) => {
  try {
    const { currentUser, conversationId, messageId, t } = payload;

    //check existing conversation
    const conversation = await checkExistence(
      Conversation,
      conversationId,
      t('conversation.error.conversationDoesNotExist')
    );

    //check user in conversation
    checkUserInConversation(conversation!, currentUser._id, t);

    //check existing messages
    const message = await checkExistence(Message, messageId, t('message.error.messageNotExist'));

    //check message in converation
    checkMessageInConversation(conversationId, message!.conversationId, t);

    const isPin = !message?.isPin;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        isPin,
      },
      { new: true }
    );

    return updatedMessage;
  } catch (error) {
    handleError(error);
  }
};
