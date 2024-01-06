import { Request } from 'express';
import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { Conversation, IUser, Message } from '../models';
import { TPayloadSendMessage } from '../types';
import { areUserIdsEqual, parseNumber } from '../utils';

export const sendMessageService = async (payload: TPayloadSendMessage, req: Request) => {
  try {
    const { user, conversationsId, title } = payload;
    const currentUserId = user?._id;

    //check conversation exist
    const conversation = await Conversation.findById(conversationsId);
    if (!conversation) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        req.t('conversation.error.conversationDoesNotExist')
      );
    }

    // check user is in conversation
    const isUserInConversation = conversation?.participants?.some((id) =>
      areUserIdsEqual({
        userId1: currentUserId,
        userId2: id,
      })
    );
    if (!isUserInConversation) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        req.t('conversation.error.userIsNotPartOfThisConversation')
      );
    }

    // create new message
    const newMessage = await Message.create({
      title,
      senderId: currentUserId,
      conversationsId,
    });

    return newMessage;
  } catch (error) {
    handleError(error);
  }
};

export const getListMessageByConversationIdService = async (payload: {
  user: IUser;
  conversationId: string;
  page?: string;
  limit?: string;
  req: Request;
}) => {
  try {
    const { user, conversationId, page, limit, req } = payload;

    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);
    const startIndex = (_page - 1) * _limit;

    const conversation = await Conversation.findById(conversationId);
    //check existing conversation
    if (!conversation) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        req.t('conversation.error.conversationDoesNotExist')
      );
    }
    //check user in conversation
    const isAuth = conversation.participants.find((item) =>
      areUserIdsEqual({ userId1: user._id, userId2: item })
    );
    if (!isAuth) {
      throw new ApiError(httpStatus.UNAUTHORIZED, req.t('conversation.error.accesscConversation'));
    }

    const messages = await Message.find({ conversationsId: conversationId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .populate('senderId', '-role -password -createdAt -updatedAt')
      .exec();

    return { messages };
  } catch (error) {
    handleError(error);
  }
};
