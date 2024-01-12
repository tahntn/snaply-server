import mongoose from 'mongoose';
import { ApiError, handleError } from '../errors';
import { Conversation, IConversation, IUser, User } from '../models';
import { IQueryUser } from '../types';
import { areIdsEqual, hashEmail, parseNumber, randomNumber, removeEmptyFields } from '../utils';
import { Request } from 'express';
import { TFunction } from 'i18next';
import { httpStatus, selectFieldUser, selectWithoutField } from '../constant';
import { checkExistence } from './common.service';
import { checkUserInConversation } from './message.service';
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
    const validParticipants = participants.filter((user) => !areIdsEqual(user, userId));

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
        lastActivity: {
          senderId: userId,
          type: 'init',
        },
      });
      await newConversation.save();
      return newConversation;
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
      lastActivity: {
        senderId: userId,
        type: 'init',
      },
    });
    await newConversation.save();
    return newConversation;
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
      .populate('participants', selectFieldUser)
      .populate('lastActivity.senderId', selectFieldUser)
      .select(selectWithoutField)
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

export const getDetailConversationService = async (
  conversationId: mongoose.Types.ObjectId,
  currentUser: Express.User,
  t: TFunction<'translation', undefined>
) => {
  try {
    const conversation = await Conversation.findById(conversationId).populate(
      'participants',
      selectFieldUser
    );
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, t('conversation.error.conversationDoesNotExist'));
    }
    return conversation;
  } catch (error) {
    handleError(error);
  }
};

export const updateGroupConversationService = async (
  conversationId: mongoose.Types.ObjectId,
  currentUser: IUser,
  t: TFunction<'translation', undefined>,
  payload: { nameGroup?: string; avatarGroup?: string }
) => {
  try {
    const _payload = removeEmptyFields(payload);

    //check pass body
    if (Object.keys(_payload).length === 0) {
      throw new ApiError(httpStatus.BAD_GATEWAY, t('error.pleasePassData'));
    }

    //check existing conversation
    const conversation = await checkExistence(
      Conversation,
      conversationId,
      t('conversation.error.conversationDoesNotExist')
    );

    //check user in conversation
    checkUserInConversation(conversation!, currentUser._id, t);

    if (!conversation?.isGroup) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        t('conversation.updateConversation.onlyUpdateGroupConversation')
      );
    }
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: _payload,
      },
      { new: true }
    );
    return updatedConversation;
  } catch (error) {
    handleError(error);
  }
};
