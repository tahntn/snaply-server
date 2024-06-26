import { Request } from 'express';
import { ApiError, handleError } from '../errors';
import { httpStatus } from '../constant';
import Friend from '../models/friend.model';
import { areIdsEqual, parseNumber, pick } from '../utils';
import { createConversationService } from './conversation.service';
import {
  ICheckFriend,
  ICreateFriendRequest,
  IUpdateStateFriendRequest,
} from '../types/friend.interface';
import { getUserByIdService } from './user.service';
import { IConversation, IUser } from '../models';
import { checkExistence } from './common.service';
import { TFunction } from 'i18next';

export const checkFriendRequest = async (
  payload: ICheckFriend,
  t: TFunction<'translation', undefined>
) => {
  try {
    const { userId1, userId2 } = payload;

    const areEqual = areIdsEqual(userId1, userId2);
    if (areEqual) {
      throw new ApiError(httpStatus.UNAUTHORIZED, t('auth.error.unauthorized'));
    }

    const friend = await Friend.findOne({
      $or: [
        { userId: userId1, targetUserId: userId2 },
        { userId: userId2, targetUserId: userId1 },
      ],
    });

    return friend;
  } catch (error) {
    handleError(error);
  }
};

export const createFriendRequestService = async (payload: ICreateFriendRequest) => {
  try {
    const { t, receiverUserId, currentUser } = payload;

    //check receiver user
    const receiverUser = await getUserByIdService(receiverUserId, t);
    if (!receiverUser) {
      throw new ApiError(httpStatus.NOT_FOUND, t('friend.error.receiverNotFound'));
    }

    //check friend request
    const friendRequest = await checkFriendRequest(
      {
        userId1: receiverUser._id,
        userId2: currentUser._id,
      },
      t
    );

    if (friendRequest) {
      //check status accept
      if (friendRequest.status === 'accept') {
        throw new ApiError(httpStatus.BAD_REQUEST, t('friend.error.youAreAlreadyFriends'));
      }
      //check status pending
      throw new ApiError(httpStatus.BAD_REQUEST, t('friend.error.invitationAlreadySent'));
    }

    //Create your request list
    const request = await Friend.create({
      userId: currentUser?._id,
      targetUserId: receiverUser?._id,
      status: 'pending',
    });

    return request;
  } catch (error) {
    handleError(error);
  }
};

export const confirmFriendRequestService = async (payload: IUpdateStateFriendRequest) => {
  try {
    const { t, friendRequestId, currentUser, pusher } = payload;
    const friendRequest = await checkExistence(
      Friend,
      friendRequestId,
      t('friend.error.friendRequestNotFound')
    );

    if (friendRequest!.status !== 'pending') {
      throw new ApiError(httpStatus.NOT_FOUND, t('friend.error.youAreAlreadyFriends'));
    }

    if (!areIdsEqual(friendRequest!.targetUserId, currentUser._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, t('auth.error.unauthorized'));
    }
    await Friend.findByIdAndUpdate(friendRequestId, { status: 'accept' }, { new: true });

    const res = await createConversationService({
      currentUser,
      data: {
        participants: [friendRequest!.userId],
      } as IConversation,
      t,
      pusher,
    });
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const denyFriendRequestService = async (payload: IUpdateStateFriendRequest) => {
  try {
    const { t, friendRequestId, currentUser } = payload;
    //check friend request, status pending
    const friendRequest = await Friend.findOne({
      _id: friendRequestId,
      status: 'pending',
    });

    if (!friendRequest) {
      throw new ApiError(httpStatus.NOT_FOUND, t('friend.error.friendRequestNotFound'));
    }

    if (!areIdsEqual(friendRequest.targetUserId, currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, t('auth.error.unauthorized'));
    }

    await Friend.deleteOne(friendRequestId);

    return;
  } catch (error) {
    handleError(error);
  }
};

export const getListFriendByUserIdService = async (req: Request) => {
  try {
    const currentUser = req.user!;
    const query = pick(req.query, ['limit', 'page', 'type']);
    const { limit, page, type } = query;

    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);
    const _type = type || 'friends';

    const startIndex = (_page - 1) * _limit;

    const queryObj = {
      $and: [
        {
          status: _type === 'friendRequests' ? 'pending' : 'accept',
        },
        {
          ...(_type === 'friendRequests' && { targetUserId: currentUser?._id }),
          ...(_type === 'friends' && {
            $or: [{ userId: currentUser?._id }, { targetUserId: currentUser?._id }],
          }),
        },
      ],
    };
    const selectFields = 'username email avatar _id';
    const friends = await Friend.find(queryObj)
      .populate([
        { path: 'userId', select: selectFields },
        { path: 'targetUserId', select: selectFields },
      ])

      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .lean()
      .exec();

    // const totalFriends = await Friend.countDocuments(queryObj).exec();
    // const totalPages = Math.ceil(totalFriends / _limit);

    const _friend = friends.map((friend) => {
      const { targetUserId, userId, ...infoFriend } = friend;
      const areEqual = areIdsEqual(targetUserId._id, currentUser._id);
      const user = areEqual ? userId : targetUserId;
      return {
        ...infoFriend,
        user,
      };
    });

    return {
      data: _friend,
      pagination: {
        page: _page,
        limit: _limit,
        // totalPages,
        // totalFriends,
      },
    };
  } catch (error) {
    handleError(error);
  }
};

export const getListFriendSortByAlphabetService = async (req: Request) => {
  try {
    const currentUser = req.user!;
    const query = pick(req.query, ['limit', 'page', 'q']);
    const { limit, page, q } = query;

    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);
    const startIndex = (_page - 1) * _limit;

    const queryObj = {
      $and: [
        {
          status: 'accept',
        },
        {
          $or: [{ userId: currentUser?._id }, { targetUserId: currentUser?._id }],
        },
      ],
    };
    const friends = await Friend.aggregate([
      // 1. Get all friends of user
      {
        $match: {
          ...queryObj,
        },
      },
      // 2. Look up to fill user or targetUser data
      {
        $addFields: {
          lookupField: {
            $cond: {
              if: { $eq: ['$userId', currentUser?._id] },
              then: '$targetUserId',
              else: '$userId',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lookupField',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },

      // 3. Remove unused fields
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          'user._id': 1,
          'user.username': 1,
          'user.email': 1,
          'user.avatar': 1,
        },
      },

      // 4. Search user

      {
        $match: {
          'user.username': { $regex: q || '', $options: 'i' },
        },
      },
      // 5. Group by first letter name user
      {
        $group: {
          _id: {
            $substr: [{ $toLower: '$user.username' }, 0, 1],
          },
          friends: {
            $push: '$$ROOT',
          },
        },
      },
      // 6. Pagination
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: _limit,
      },
    ]);

    return {
      data: friends,
      pagination: {
        page: _page,
        limit: _limit,
      },
    };
  } catch (error) {
    handleError(error);
  }
};

export const getTotalListFriendtService = async (data: {
  currentUser: IUser;
  type: 'friendRequests' | undefined;
}) => {
  try {
    const { currentUser, type } = data;

    const _type = type || 'friends';
    const queryObj = {
      $and: [
        {
          status: _type === 'friendRequests' ? 'pending' : 'accept',
        },
        {
          ...(_type === 'friendRequests' && { targetUserId: currentUser?._id }),
          ...(_type === 'friends' && {
            $or: [{ userId: currentUser?._id }, { targetUserId: currentUser?._id }],
          }),
        },
      ],
    };
    const total = await Friend.countDocuments(queryObj).exec();
    return total;
  } catch (error) {
    handleError(error);
  }
};
