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
import { IConversation } from '../models';
import { checkExistence } from './common.service';

export const checkFriendRequest = async (payload: ICheckFriend, req: Request) => {
  try {
    const { userId1, userId2 } = payload;

    const areEqual = areIdsEqual(userId1, userId2);
    if (areEqual) {
      throw new ApiError(httpStatus.UNAUTHORIZED, req.t('auth.error.unauthorized'));
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
    const { req, receiverUserId } = payload;
    const currentUser = req.user!;

    //check receiver user
    const receiverUser = await getUserByIdService(receiverUserId, req);
    if (!receiverUser) {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('friend.error.receiverNotFound'));
    }

    //check friend request
    const friendRequest = await checkFriendRequest(
      {
        userId1: receiverUser._id,
        userId2: currentUser._id,
      },
      req
    );

    if (friendRequest) {
      //check status accept
      if (friendRequest.status === 'accept') {
        throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.youAreAlreadyFriends'));
      }
      //check status pending
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('friend.error.invitationAlreadySent'));
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
    const { req, friendRequestId } = payload;

    const currentUser = req.user!;
    const friendRequest = await checkExistence(
      Friend,
      friendRequestId,
      req.t('friend.error.friendRequestNotFound')
    );

    if (friendRequest!.status !== 'pending') {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('friend.error.youAreAlreadyFriends'));
    }

    if (!areIdsEqual(friendRequest!.targetUserId, currentUser._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('auth.error.unauthorized'));
    }
    await Friend.findByIdAndUpdate(friendRequestId, { status: 'accept' }, { new: true });

    const res = await createConversationService({
      currentUser,
      data: {
        participants: [friendRequest!.targetUserId],
      } as IConversation,

      req,
    });
    return res?.conversation;
  } catch (error) {
    handleError(error);
  }
};

export const denyFriendRequestService = async (payload: IUpdateStateFriendRequest) => {
  try {
    const { req, friendRequestId } = payload;
    const currentUser = req.user!;
    //check friend request, status pending
    const friendRequest = await Friend.findOne({
      _id: friendRequestId,
      status: 'pending',
    });

    if (!friendRequest) {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('friend.error.friendRequestNotFound'));
    }

    if (!areIdsEqual(friendRequest.targetUserId, currentUser._id)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, req.t('auth.error.unauthorized'));
    }

    await Friend.deleteOne(friendRequestId);

    return true;
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
