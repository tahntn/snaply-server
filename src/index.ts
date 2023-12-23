import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';
dotenv.config();

const app: Express = express();
app.use(express());
app.use(cors({}));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;

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
