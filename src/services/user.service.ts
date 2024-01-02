import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { IUser, User } from '../models';
import { IQueryUser } from '../types';
import { parseNumber } from '../utils';
import { Request } from 'express';

export const getUserByIdService = async (id: mongoose.Types.ObjectId, req: Request) => {
  try {
    const user = await User.findById(id);
    if (user === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('user.error.userNotFound'));
    }
    return user;
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
      .select('-role -createdAt -updatedAt -password -__v')
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

export const updateUserService = async (id: string, data: Partial<IUser>, req: Request) => {
  try {
    const { email, password } = data;

    //check user
    const checkUser = await User.findOne({
      _id: id,
    });
    if (checkUser === null) {
      throw new ApiError(httpStatus.NOT_FOUND, req.t('user.error.userNotFound'));
    }

    if (email) {
      const existingEmail = await User.findOne({
        email,
      });

      //check existing email
      if (existingEmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, req.t('user.error.emailAlready'));
      }
    }

    if (password) {
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      data = {
        ...data,
        password: hashedPassword,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    return {
      data: updatedUser,
    };
  } catch (error) {
    handleError(error);
  }
};
