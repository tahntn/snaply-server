/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpStatus } from '../constant';
import { ApiError } from '../errors';
import User from '../models/user.model';
import bcrypt from 'bcrypt';

export const loginUserService = async (email: string, password: string): Promise<any> => {
  try {
    //find User
    const checkUser = await User.findOne({
      email,
    });

    if (checkUser === null) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email does not exist.');
    } else {
      //check password
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password.');
      }

      return {
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: 'Login successful.',
        data: {
          checkUser,
        },
      };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      const errorMessage = error.message;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
};
