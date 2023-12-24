/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { loginUserService, registerUserService } from '../services';

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Please provide complete information.',
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Please enter a valid email.',
      });
    }
    const response = await loginUserService(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(404).json({
      status: 'ERROR',
      message: error.message || 'Login failed',
    });
  }
};

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, userName } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword || !userName) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Please provide complete information.',
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Please enter a valid email.',
      });
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Password and confirm password does not match.',
      });
    }

    const response = await registerUserService(req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(404).json({
      status: 'ERROR',
      message: error.message || 'Login failed',
    });
  }
};
