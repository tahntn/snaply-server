/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '../models/user.model';
import { TNewRegisteredUser } from '../types';

export const registerUserService = async (newUser: TNewRegisteredUser) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = newUser;
      if (await User.isEmailTaken(email)) {
        resolve({
          status: 'ERROR',
          message: 'Email already taken.',
        });
      }
      const user = await User.create(newUser);

      resolve({
        status: 'SUCCESS',
        message: 'Register successfully',
        data: {
          user,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
