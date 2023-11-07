import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import router from './router';

const app = express();
dotenv.config();
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const MONGO_URI = process.env.MONGO_URI.replace(
  '<password>',
  process.env.MONGO_PASSWORD,
);

server.listen(8080, () =>
  console.log('server running on http://localhost:8080/'),
);

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI).then(() => console.log('connection successful'));
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/v1/', router());
