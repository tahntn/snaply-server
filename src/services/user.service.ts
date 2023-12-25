import bcrypt from 'bcrypt';

import { httpStatus } from '../constant';
import { ApiError, handleError } from '../errors';
import { IUser, User } from '../models';
import { IQueryUser } from '../types';
import { parseNumber } from '../utils';

export const getUserByIdService = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (user === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }
    return user;
  } catch (error) {
    handleError(error);
  }
};

export const searchUserNameService = async ({ page, limit, q }: IQueryUser) => {
  try {
    const _page = parseNumber(page, 1);
    const _limit = parseNumber(limit, 5);

    const startIndex = (_page - 1) * _limit;
    const query = {
      userName: { $regex: q, $options: 'i' },
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
      code: httpStatus.OK,
      message: 'Search user successful.',
      data: {
        data: users,
        pagination: {
          totalPages,
          page: _page,
          limit: _limit,
          totalUsers,
        },
      },
    };
  } catch (error) {
    handleError(error);
  }
};

export const updateUserService = async (id: string, data: Partial<IUser>) => {
  try {
    const { email, password } = data;

    //check user
    const checkUser = await User.findOne({
      _id: id,
    });
    if (checkUser === null) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (email) {
      const existingEmail = await User.findOne({
        email,
      });

      //check existing email
      if (existingEmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already registered.');
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
      code: httpStatus.OK,
      message: 'Updated successful.',
      data: {
        updatedUser,
      },
    };
  } catch (error) {
    handleError(error);
  }
};
