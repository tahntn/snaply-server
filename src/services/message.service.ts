import { Request } from 'express';
import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { Conversation, Message } from '../models';
import { TPayloadSendMessage } from '../types';

export const sendMessageService = async (payload: TPayloadSendMessage, req: Request) => {
  try {
    const { user, conversationsId, title } = payload;
    const currentUserId = user?._id;

    //check conversation exist
    const conversation = await Conversation.findById(conversationsId);
    if (!conversation) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('conversation.error.conversationNotFound'));
    }

    // check user is in conversation
    const isUserInConversation = conversation?.participants?.some((id) => currentUserId.equals(id));
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
