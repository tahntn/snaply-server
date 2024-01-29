import mongoose from 'mongoose';
import { ApiError, handleError } from '../errors';
import { Conversation, IConversation, IMessage, IUser, User } from '../models';
import { IQueryUser } from '../types';
import { areIdsEqual, hashEmail, parseNumber, randomNumber, removeEmptyFields } from '../utils';
import { TFunction } from 'i18next';
import { httpStatus, selectFieldUser, selectWithoutField } from '../constant';
import { checkExistence } from './common.service';
import { checkUserInConversation, sendMessageService } from './message.service';
import Pusher from 'pusher';

export const createConversationService = async (payload: {
  currentUser: Express.User;
  data: IConversation;
  t: TFunction<'translation', undefined>;
  pusher: Pusher;
}) => {
  try {
    const { currentUser, t, data, pusher } = payload;
    const { participants, isGroup, nameGroup, avatarGroup } = data;
    const userId = currentUser._id;

    //check current user existing in participants
    const validParticipants = participants.filter((user) => !areIdsEqual(user, userId));

    if (validParticipants.length !== participants.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        t('conversation.createConversation.participantsIncludeCurrentUser')
      );
    }

    // check existing users
    const existingUsers = await User.find({ _id: { $in: participants } });

    if (existingUsers.length !== participants.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        t('conversation.createConversation.participantsNotExist')
      );
    }

    if (!isGroup) {
      const userId2 = participants[0];

      //check existing conversation
      const existingConversation = await Conversation.find({
        $and: [
          {
            $or: [
              { participants: { $all: [userId, userId2] } },
              { participants: { $all: [userId2, userId] } },
            ],
          },
          {
            isGroup: false,
          },
        ],
      });
      if (existingConversation.length > 0) {
        return existingConversation[0];
      }

      //create new conversation
      const newConversation = new Conversation({
        participants: [userId, userId2],
      });
      const _newConversation = await newConversation.save();

      const res = await sendMessageService(
        {
          user: currentUser,
          conversationId: _newConversation.id,
          title: 'new',
          type: 'update',
          imageList: [],
          t,
        },
        pusher
      );

      const _newConversationPopulated = await _newConversation.populate('participants');
      const _newConversationObj = {
        ..._newConversationPopulated.toObject(),
        lastActivity: {
          lastMessage: {
            ...res?.message.toObject(),
            senderId: {
              username: currentUser?.username,
              email: currentUser?.email,
              id: currentUser?.id,
              avatar: currentUser?.avatar,
            },
          },
        },
      };

      _newConversation.participants.forEach(async (participant) => {
        if (participant._id) {
          await pusher.trigger(participant._id.toString(), 'conversation:new', _newConversationObj);
        }
      });
      return res?.updatedConversation;
    }

    // Group conversation

    const _nameGroup = nameGroup || existingUsers.map((user) => user.username).join(', ');

    let _avatarGroup = avatarGroup || '';
    if (!avatarGroup) {
      const _randomNumber = randomNumber(10000000);
      const hashedEmail = await hashEmail(_nameGroup + _randomNumber);
      _avatarGroup = 'https://www.gravatar.com/avatar/' + hashedEmail + '?d=retro&s=400';
    }
    //create new group conversation
    const newConversation = new Conversation({
      participants: [userId, ...participants],
      nameGroup: _nameGroup,
      avatarGroup: _avatarGroup,
      isGroup,
    });
    const _newConversation = await newConversation.save();
    const res = await sendMessageService(
      {
        user: currentUser,
        conversationId: _newConversation.id,
        title: 'new',
        type: 'update',
        imageList: [],
        t,
      },
      pusher
    );

    const _newConversationPopulated = await _newConversation.populate('participants');

    const _newConversationObj = {
      ..._newConversationPopulated.toObject(),
      lastActivity: {
        lastMessage: {
          ...res?.message.toObject(),
          senderId: {
            username: currentUser?.username,
            email: currentUser?.email,
            id: currentUser?.id,
            avatar: currentUser?.avatar,
          },
        },
      },
    };

    _newConversation.participants.forEach(async (participant) => {
      if (participant._id) {
        await pusher.trigger(participant._id.toString(), 'conversation:new', _newConversationObj);
      }
    });

    return res?.updatedConversation;
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
      .populate({
        path: 'lastActivity.lastMessage',
        select: selectWithoutField,
        populate: {
          path: 'senderId',
          select: selectFieldUser,
        },
      })

      .select(selectWithoutField)
      .sort({ updatedAt: -1 })
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
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', selectFieldUser)
      .populate({
        path: 'lastActivity.lastMessage',
        select: selectWithoutField,
        populate: {
          path: 'senderId',
          select: selectFieldUser,
        },
      });
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
  payload: { nameGroup?: string; avatarGroup?: string },
  pusher: Pusher
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
    checkUserInConversation({
      conversation: conversation!,
      t,
      currentUserId: currentUser._id,
    });

    if (!conversation?.isGroup) {
      throw new ApiError(
        httpStatus.BAD_GATEWAY,
        t('conversation.updateConversation.onlyUpdateGroupConversation')
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: _payload,
      },
      { new: true }
    );

    const { nameGroup, avatarGroup } = payload;
    let res:
      | {
          // eslint-disable-next-line @typescript-eslint/ban-types
          message: mongoose.Document<unknown, {}, IMessage> &
            IMessage & {
              _id: mongoose.Types.ObjectId;
            };
          updatedConversation: // eslint-disable-next-line @typescript-eslint/ban-types
          | (mongoose.Document<unknown, {}, IConversation> &
                IConversation & {
                  _id: mongoose.Types.ObjectId;
                })
            | null;
        }
      | undefined;
    if (nameGroup) {
      res = await sendMessageService(
        {
          user: currentUser,
          conversationId: conversationId,
          title: 'change_name_group',
          type: 'update',
          imageList: [],
          t,
        },
        pusher
      );
    }

    if (avatarGroup) {
      res = await sendMessageService(
        {
          user: currentUser,
          conversationId: conversationId,
          title: 'change_avatar_group',
          type: 'update',
          imageList: [],
          t,
        },
        pusher
      );
    }

    return res?.updatedConversation;
  } catch (error) {
    handleError(error);
  }
};

export const typingMessageService = async (payload: {
  currentUser: IUser;
  conversationId: string;
  pusher: Pusher;
  isTyping: boolean;
}) => {
  try {
    const { currentUser, conversationId, pusher, isTyping } = payload;

    await pusher.trigger(conversationId, 'message:typing', {
      isTyping,
      userTyping: {
        username: currentUser.username,
        email: currentUser.email,
        id: currentUser.id,
        avatar: currentUser.avatar,
      },
    });

    return;
  } catch (error) {
    handleError(error);
  }
};
