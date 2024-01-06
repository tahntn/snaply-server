import mongoose from 'mongoose';
import { ApiError, handleError } from '../errors';
import { Conversation, IConversation, IUser, User } from '../models';
import { getUserByIdService } from './user.service';
import { IQueryUser } from '../types';
import { areUserIdsEqual, hashEmail, parseNumber, randomNumber } from '../utils';
import { Request } from 'express';
import { httpStatus } from '../constant';
export const createConversationService = async (payload: {
  currentUser: Express.User;
  data: IConversation;
  req: Request;
}) => {
  try {
    const { currentUser, req, data } = payload;
    const { participants, isGroup, nameGroup, avatarGroup } = data;
    const userId = currentUser._id;

    //check curent user existing in participants
    const validParticipants = participants.filter(
      (user) =>
        !areUserIdsEqual({
          userId1: user,
          userId2: userId,
        })
    );

    if (validParticipants.length !== participants.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        req.t('conversation.createConversation.participantsIncludeCurrentUser')
      );
    }

    // check existing users
    const existingUsers = await User.find({ _id: { $in: participants } });

    if (existingUsers.length !== participants.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        req.t('conversation.createConversation.participantsNotExist')
      );
    }

    if (!isGroup) {
      const userId2 = participants[0];

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
    }

    const _nameGroup = nameGroup || existingUsers.map((user) => user.username).join(', ');

    let _avatarGroup = avatarGroup || '';
    if (!avatarGroup) {
      const _randomNumber = randomNumber(10000000);
      const hashedEmail = await hashEmail(_nameGroup + _randomNumber);
      _avatarGroup = 'https://www.gravatar.com/avatar/' + hashedEmail + '?d=retro&s=400';
    }
    const newConversation = new Conversation({
      participants: [userId, ...participants],
      nameGroup: _nameGroup,
      avatarGroup: _avatarGroup,
      isGroup,
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
      .populate('participants', 'username avatar')
      .select('-createdAt -updatedAt -__v')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .lean()
      .exec();

    return {
      data: conversations,
      pagination: {
        page: _page,
        limit: _limit,
      },
    };
  } catch (error) {
    handleError(error);
  }
};
