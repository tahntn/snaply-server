import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import mongoose from 'mongoose';
import passport from 'passport';
import { errorConverter, errorHandler } from './errors';
import { jwtStrategy } from './config';
import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import { IUser } from './models';
import Pusher from 'pusher';
import { pusherMiddleware } from './middlewares';
import cron from 'node-cron';
dotenv.config();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface User extends IUser {}
    export interface Request {
      pusher: Pusher;
    }
  }
}

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'en',
    preload: ['en', 'vi'],
  });

const app: Express = express();

app.use(express());
app.use(cors({}));
app.use(bodyParser.json());
app.use(i18nextMiddleware.handle(i18next));
app.use(pusherMiddleware);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//connect to MongoDB
if (process.env.MONGO && process.env.MONGO_PASSWORD) {
  const DB = process.env.MONGO.replace('<PASSWORD>', process.env.MONGO_PASSWORD);
  mongoose
    .connect(DB)
    .then(() => {
      console.log('Connected to MongoDB successful!');
    })
    .catch(() => {
      console.log('Connected to MongoDB fail!');
    });
} else {
  console.log('Missing env!');
}

//initialize the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

//initiate router
app.use('/api/v1', router);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  server.close();
  process.exit(1);
});
process.on('uncaughtException', (e) => {
  console.error('Uncaught exception at:', e);
  server.close();
  process.exit(1);
});
