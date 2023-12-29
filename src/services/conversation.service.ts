import mongoose from 'mongoose';
import { handleError } from '../errors';
import { Conversation, IUser } from '../models';
import { getUserByIdService } from './user.service';
import { IQueryUser } from '../types';
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

export const getConversationsService = async (user: IUser, { page, limit }: IQueryUser) => {
  try {
    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);

    const startIndex = (_page - 1) * _limit;

    const conversations = await Conversation.find({
      participants: { $in: [user._id] },
    })
      .select('-createdAt -updatedAt -__v')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .lean()
      .exec();

    return { conversations };
  } catch (error) {
    handleError(error);
  }
};
