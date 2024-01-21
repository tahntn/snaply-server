import { Request, Response, NextFunction } from 'express';
import { pusher } from '../config';

const pusherMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.pusher = pusher;
  next();
};

export default pusherMiddleware;
