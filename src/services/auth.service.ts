/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '../models/user.model';
import bcrypt from 'bcrypt';
export const loginUserService = async (newUser: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = newUser;

      const checkUser = await User.findOne({
        email,
      });

      if (checkUser === null) {
        resolve({
          status: 'ERROR',
          message: 'Email does not exist.',
        });
      } else {
        const comparePassword = bcrypt.compareSync(password, checkUser.password);
        if (!comparePassword) {
          resolve({
            status: 'ERROR',
            message: 'Incorrect password.',
          });
        }

        resolve({
          status: 'SUCCESS',
          message: 'Login successful.',
          data: {
            checkUser,
          },
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
