import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { User } from '../models';
import { ApiError, handleError } from '../errors';
import { INewRegisteredUser } from '../types';
import { httpStatus } from '../constant';
import Token from '../models/token.model';
import { TokenPayload, tokenTypes } from '../types/token.interface';
import { generateAccessTokens, verifyToken } from './token.service';
import { getUserByIdService } from './user.service';
import { Request } from 'express';

export const loginUserService = async (email: string, password: string, req: Request) => {
  try {
    //find User
    const checkUser = await User.findOne({
      email,
    });
    if (checkUser === null) {
      throw new ApiError(httpStatus.UNAUTHORIZED, req.t('user.error.EmaileoesNotExist'));
    } else {
      //compare password
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      //check password
      if (!comparePassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, req.t('user.error.incorrectPassword'));
      }

      return {
        user: checkUser,
      };
    }
  } catch (error) {
    handleError(error);
  }
};

export const registerUserService = async (newUser: INewRegisteredUser, req: Request) => {
  try {
    const { email, username, password } = newUser;

    // check existing email
    const existingEmailUser = await User.findOne({ email });

    if (existingEmailUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, req.t('user.error.emailAlready'));
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return { user };
  } catch (error) {
    handleError(error);
  }
};

export const logoutService = async (refreshToken: string, req: Request): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, req.t('token.error.notFound'));
  }
  await refreshTokenDoc.deleteOne();
};

export const refreshTokensService = async (
  refreshToken: string,
  req: Request
): Promise<TokenPayload> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserByIdService(new mongoose.Types.ObjectId(refreshTokenDoc.user), req);
    if (!user) {
      throw new Error();
    }
    const tokens = await generateAccessTokens(user);
    return tokens;
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, req.t('auth.error.unauthorized'));
  }
};
