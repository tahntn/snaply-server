import mongoose from 'mongoose';
import { ApiError, handleError } from '../errors';
import { Conversation, IUser, Message } from '../models';
import { getUserByIdService } from './user.service';
import { httpStatus } from '../constant';
import { parseNumber } from '../utils';

export const createConversationService = async (payload: {
  user: IUser;
  participants: string[];
}) => {
  try {
    const { user, participants } = payload;
    const userId = user._id;
    const userId2 = participants[0];
    //check user
    const checkUser = await getUserByIdService(userId);
    if (!checkUser) {
      throw new Error();
    }

    //check participant
    const checkParticipant = await getUserByIdService(new mongoose.Types.ObjectId(userId2));
    if (!checkParticipant) {
      throw new Error();
    }

    //check existing conversation
    const existingConversation = await Conversation.find({
      $or: [
        { participants: { $all: [userId, userId2] } },
        { participants: { $all: [userId2, userId] } },
      ],
    });
    if (existingConversation.length > 0) {
      return { conversation: existingConversation[0] };
    }
    const newConversation = new Conversation({
      participants: [userId, userId2],
    });
    await newConversation.save();
    return { conversation: newConversation };
  } catch (error) {
    handleError(error);
  }
};

export const getConversationByIdService = async (payload: {
  user: IUser;
  conversationId: string;
  page?: string;
  limit?: string;
}) => {
  try {
    const { user, conversationId, page, limit } = payload;

    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);
    const startIndex = (_page - 1) * _limit;

    const conversation = await Conversation.findById(conversationId);
    //check existing conversation
    if (!conversation) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Conversation id  does not exist.');
    }

    //check user in conversation
    const isAuth = conversation.participants.find((item) => user._id.equals(item));
    if (!isAuth) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You do not have access to this conversation ');
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
