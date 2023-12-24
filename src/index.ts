import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
import mongoose from 'mongoose';
dotenv.config();

const app: Express = express();
app.use(express());
app.use(cors({}));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;

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
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

//initiate router
app.use('/api/v1', router);

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
