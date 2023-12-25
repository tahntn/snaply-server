import bcrypt from 'bcrypt';

import { User } from '../models';
import { ApiError, handleError } from '../errors';
import { INewRegisteredUser } from '../types';
import { httpStatus } from '../constant';

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
        code: httpStatus.OK,
        status: 'SUCCESS',
        message: 'Login successful.',
        data: {
          checkUser,
        },
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
