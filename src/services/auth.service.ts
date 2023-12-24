import { httpStatus } from '../constant';
import { ApiError } from '../errors';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import { INewRegisteredUser } from '../types';

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
    if (error instanceof ApiError) {
      const errorMessage = error.message;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
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
    if (error instanceof ApiError) {
      const errorMessage = error.message;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
};
