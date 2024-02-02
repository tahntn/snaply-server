import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { Conversation, IConversation, IUser, Message } from '../models';
import { TPayloadSendMessage } from '../types';
import { areIdsEqual, parseNumber } from '../utils';
import mongoose from 'mongoose';
import { TFunction } from 'i18next';
import { checkExistence } from './common.service';
import Pusher from 'pusher';

export const checkUserInConversation = (payload: {
  conversation: IConversation;
  currentUserId: mongoose.Types.ObjectId;
  t: TFunction<'translation', undefined>;
}) => {
  const { conversation, currentUserId, t } = payload;
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

export const sendMessageService = async (payload: TPayloadSendMessage, pusher: Pusher) => {
  try {
    const { user, conversationId, title, type = 'text', imageList = [], replyTo, url, t } = payload;
    const currentUserId = user?._id;

    if (type === 'image') {
      if (!imageList?.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, t('message.error.imageRequired'));
      }
    }

    if (type === 'gif' || type === 'sticker') {
      if (!url) {
        throw new ApiError(httpStatus.BAD_REQUEST, t('message.sendMessage.url.pleaseAddUrl'));
      }
    }
    //check conversation exist
    const conversation = await checkExistence(
      Conversation,
      conversationId,
      t('conversation.error.conversationDoesNotExist')
    );

    // check user is in conversation
    checkUserInConversation({
      conversation: conversation!,
      t,
      currentUserId,
    });

    if (replyTo) {
      //check existing messages
      const message = await checkExistence(Message, replyTo, t('message.error.messageNotExist'));

      //check message in converation
      checkMessageInConversation(conversationId, message!.conversationId, t);
    }

    // create new message
    const newMessage = await Message.create({
      title: type === 'text' || type === 'update' ? title : '',
      senderId: currentUserId,
      conversationId,
      type,
      imageList: type === 'image' ? imageList : [],
      replyTo,
      url,
    });

    //trigger to conversation new message
    await pusher.trigger(conversationId.toString(), 'message:new', {
      ...newMessage.toObject(),
      senderId: {
        username: user.username,
        email: user.email,
        id: user.id,
        avatar: user.avatar,
      },
    });

    // update last active
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversation?._id,
      {
        lastActivity: {
          lastMessage: newMessage,
        },
      },
      { new: true }
    );

    //trigger to user conversation updated
    if (type != 'update' || (type === 'update' && title !== 'new')) {
      const _newConversationPopulated = await updatedConversation!.populate('participants');
      console.log(
        '🚀 ~ sendMessageService ~ _newConversationPopulated:',
        _newConversationPopulated
      );

      _newConversationPopulated.participants.forEach(async (participant) => {
        await pusher.trigger(participant._id.toString(), 'conversation:update', 'a');
      });
    }

    return {
      message: newMessage,
      updatedConversation,
    };
  } catch (error) {
    handleError(error);
  }
};

export const getListMessageByConversationIdService = async (payload: {
  user: IUser;
  conversationId: mongoose.Types.ObjectId;
  page?: string;
  limit?: string;
  t: TFunction<'translation', undefined>;
}) => {
  try {
    const { user, conversationId, page, limit, t } = payload;

    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);
    const startIndex = (_page - 1) * _limit;
    const currentUserId = user?._id;

    //check existing conversation
    const conversation = await checkExistence(
      Conversation,
      conversationId,
      t('conversation.error.conversationDoesNotExist')
    );

    //check user in conversation
    checkUserInConversation({
      conversation: conversation!,
      t,
      currentUserId,
    });

    const messages = await Message.find({ conversationId: conversationId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .populate('senderId', '-role -password -createdAt -updatedAt')
      .populate('replyTo')
      .exec();

    return {
      data: messages,
      pagination: {
        page: _page,
        limit: _limit,
      },
    };
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
    checkUserInConversation({
      conversation: conversation!,
      t,
      currentUserId: currentUser._id,
    });

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
