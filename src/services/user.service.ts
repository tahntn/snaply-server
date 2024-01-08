import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { httpStatus, selectFieldUser } from '../constant';
import { ApiError, handleError } from '../errors';
import { IUser, User } from '../models';
import { IQueryUser } from '../types';
import { areIdsEqual, parseNumber } from '../utils';
import { Request } from 'express';
import { checkExistence } from './common.service';
import { checkFriendRequest } from './friend.service';

export const getUserByIdService = async (id: mongoose.Types.ObjectId, req: Request) => {
  try {
    const user = await User.findById(id).select(selectFieldUser);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('user.error.userNotFound'));
    }
    return user;
  } catch (error) {
    handleError(error);
  }
};

export const getDetailUserByIdService = async (id: mongoose.Types.ObjectId, req: Request) => {
  try {
    const user = await getUserByIdService(id, req);
    const currentUser = req.user;

    if (areIdsEqual(id, currentUser?._id)) {
      return { data: user };
    }

    const friendShip = await checkFriendRequest(
      {
        userId1: currentUser?._id,
        userId2: id,
      },
      req
    );
    return {
      data: user,
      friendShip,
    };
  } catch (error) {
    handleError(error);
  }
};

export const searchUserNameService = async ({
  page,
  limit,
  q,
  userId,
}: IQueryUser & { userId: mongoose.Types.ObjectId }) => {
  try {
    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);

    const startIndex = (_page - 1) * _limit;
    const query = {
      _id: { $ne: userId }, // remove current user id
      username: { $regex: q, $options: 'i' },
    };

    const users = await User.find(query)
      .select(selectFieldUser)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(_limit)
      .lean()
      .exec();

    const totalUsers = await User.countDocuments(query).exec();
    const totalPages = Math.ceil(totalUsers / _limit);

    return {
      data: users,
      pagination: {
        totalPages,
        page: _page,
        limit: _limit,
        totalUsers,
      },
    };
  } catch (error) {
    handleError(error);
  }
};

export const updateUserService = async (
  id: mongoose.Types.ObjectId,
  data: Partial<IUser>,
  req: Request
) => {
  try {
    const { email, username, avatar } = data;

    //check user
    const checkUser = await getUserByIdService(id, req);

    if (email) {
      const existingEmail = await User.findOne({
        email,
      });

      //check existing email
      if (existingEmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, req.t('user.error.emailAlready'));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        username,
        avatar,
      },
      { new: true }
    ).select(selectFieldUser);
    return {
      data: updatedUser,
    };
  } catch (error) {
    handleError(error);
  }
};
