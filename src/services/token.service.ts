import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import { ApiError } from '../errors';
import { httpStatus } from '../constant';
import {
  AccessAndRefreshTokens,
  ITokenDoc,
  TokenPayload,
  tokenTypes,
} from '../types/token.interface';
import Token from '../models/token.model';
import { IUser } from '../models';

export const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = process.env.JWT_SECRET!
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

export const saveToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

export const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

export const generateAuthTokens = async (user: IUser): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

export const generateAccessTokens = async (user: IUser): Promise<TokenPayload> => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

// export const generateResetPasswordToken = async (email: string): Promise<string> => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NO_CONTENT, '');
//   }
//   const expires = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
//   const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
//   return resetPasswordToken;
// };

// export const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
//   const expires = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
//   const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };
