import mongoose from 'mongoose';
import { handleError } from '../errors';
import { Conversation, IUser } from '../models';
import { getUserByIdService } from './user.service';

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
    const checkParticiant = await getUserByIdService(new mongoose.Types.ObjectId(userId2));
    if (!checkParticiant) {
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
