import { Request } from 'express';
import { ApiError, handleError } from '../errors';
import { httpStatus } from '../constant';
import { User } from '../models';
import Friend from '../models/friend.model';
import mongoose from 'mongoose';
import { areUserIdsEqual, parseNumber, pick } from '../utils';
import { createConversationService } from './conversation.service';
import {
  ICheckFriend,
  ICreateFriendRequest,
  IUpdateStateFriendRequest,
} from '../types/friend.interface';
import { getUserByIdService } from './user.service';

export const checkFriendRequest = async (payload: ICheckFriend, req: Request) => {
  try {
    const { userId1, userId2 } = payload;

    const areEqual = areUserIdsEqual(payload);
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

    const friendRequest = await Friend.findById(friendRequestId);

    if (!friendRequest) {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('friend.error.friendRequestNotFound'));
    }

    if (friendRequest.status !== 'pending') {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('friend.error.youAreAlreadyFriends'));
    }

    if (
      !areUserIdsEqual({
        userId1: friendRequest.targetUserId,
        userId2: currentUser._id,
      })
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('auth.error.unauthorized'));
    }
    await Friend.findByIdAndUpdate(friendRequestId, { status: 'accept' }, { new: true });

    const res = await createConversationService({
      user: currentUser,
      participants: [friendRequest.userId],
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

    if (
      !areUserIdsEqual({
        userId1: friendRequest.targetUserId,
        userId2: currentUser._id,
      })
    ) {
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

    const startIndex = (_page - 1) * _limit;

    const queryObj = {
      status: type === 'friendRequests' ? 'pending' : 'accept',
      ...(type === 'friendRequests' && { targetUserId: currentUser?._id }),
      ...(type === 'friend' && { userId: currentUser?._id }),
    };

    const selectFields = 'username email avatar _id';
    const friends = await Friend.find(queryObj)
      .populate([
        { path: 'userId', select: selectFields },
        { path: 'targetUserId', select: selectFields },
      ])
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .lean()
      .exec();

    const totalFriends = await Friend.countDocuments(queryObj).exec();
    const totalPages = Math.ceil(totalFriends / _limit);

    return {
      data: friends,
      pagination: {
        page: _page,
        limit: _limit,
        totalPages,
        totalFriends,
      },
    };
  } catch (error) {
    handleError(error);
  }
};
