import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { httpStatus, selectFieldUser } from '../constant';
import { ApiError, handleError } from '../errors';
import { IUser, User } from '../models';
import { IQueryUser } from '../types';
import { areIdsEqual, parseNumber } from '../utils';
import { checkExistence } from './common.service';
import { checkFriendRequest } from './friend.service';
import { TFunction } from 'i18next';

export const getUserByIdService = async (
  id: mongoose.Types.ObjectId,
  t: TFunction<'translation', undefined>
) => {
  try {
    const user = await User.findById(id).select(selectFieldUser);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, t('user.error.userNotFound'));
    }
    return user;
  } catch (error) {
    handleError(error);
  }
};

export const getDetailUserByIdService = async (payload: {
  id: mongoose.Types.ObjectId;
  currentUser: IUser;
  t: TFunction<'translation', undefined>;
}) => {
  try {
    const { id, currentUser, t } = payload;
    const user = await getUserByIdService(id, t);

    if (areIdsEqual(id, currentUser?._id)) {
      return { data: user };
    }

    const friendShip = await checkFriendRequest(
      {
        userId1: currentUser?._id,
        userId2: id,
      },
      t
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

    // const totalUsers = await User.countDocuments(query).exec();
    // const totalPages = Math.ceil(totalUsers / _limit);

    return {
      data: users,
      pagination: {
        page: _page,
        limit: _limit,
        // totalPages,
        // totalUsers,
      },
    };
  } catch (error) {
    handleError(error);
  }
};

export const updateUserService = async (
  id: mongoose.Types.ObjectId,
  data: Partial<IUser>,
  t: TFunction<'translation', undefined>
) => {
  try {
    const { email, username, avatar } = data;

    //check user

    if (email) {
      const existingEmail = await User.findOne({
        email,
      });

      //check existing email
      if (existingEmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, t('user.error.emailAlready'));
      }
    }

    //check existing username
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      throw new ApiError(httpStatus.BAD_REQUEST, t('user.error.usernameAlready'));
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
    return updatedUser;
  } catch (error) {
    handleError(error);
  }
};

export const changePasswordService = async (
  currentUserId: mongoose.Types.ObjectId,
  data: {
    newPassword: string;
    oldPassword: string;
  },
  t: TFunction<'translation', undefined>
) => {
  try {
    const { oldPassword, newPassword } = data;
    const checkUser = await checkExistence(User, currentUserId, t('user.error.userNotFound'));

    //compare password
    const comparePassword = bcrypt.compareSync(oldPassword, checkUser!.password);

    //check password
    if (!comparePassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, t('user.error.incorrectPassword'));
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(currentUserId, {
      password: hashedPassword,
    }).select(selectFieldUser);
    return;
  } catch (error) {
    handleError(error);
  }
};
