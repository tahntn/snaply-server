import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { User } from '../models';
import { ApiError, handleError } from '../errors';
import { INewRegisteredUser, IUserWithTokens } from '../types';
import { httpStatus } from '../constant';
import Token from '../models/token.model';
import { tokenTypes } from '../types/token.interface';
import { generateAuthTokens, verifyToken } from './token.service';
import { getUserByIdService } from './user.service';

export const loginUserService = async (email: string, password: string) => {
  try {
    //find User
    const checkUser = await User.findOne({
      email,
    });
    if (checkUser === null) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email does not exist.');
    } else {
      //compare password
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      //check password
      if (!comparePassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password.');
      }

      return {
        user: checkUser,
      };
    }
  } catch (error) {
    handleError(error);
  }
};

export const registerUserService = async (newUser: INewRegisteredUser) => {
  try {
    const { email, userName, password } = newUser;

    // check existing email
    const existingEmailUser = await User.findOne({ email });

    if (existingEmailUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already registered.');
    }

    //check existing userName
    const existingUserNameUser = await User.findOne({ userName });
    if (existingUserNameUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'UserName is already taken.');
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
    });

    return {
      code: httpStatus.CREATED,
      status: 'SUCCESS',
      message: 'Registration successful.',
      data: {
        user,
      },
    };
  } catch (error) {
    handleError(error);
  }
};

export const logoutService = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

export const refreshTokensService = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserByIdService(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};
