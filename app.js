import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import dbConnection from './dbConnection.js';
import errorHandler from './middlewares/errorMiddleware.js';
import authRouter from './routes/authRouter.js';
import formRouter from './routes/formRouter.js';
import answerRouter from './routes/answerRouter.js';
import responseRouter from './routes/responseRouter.js';

const env = dotenv.config().parsed;
const app = express();

// DB CONNECTION
dbConnection();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CLIENT_URL }));
app.use(cookieParser());
app.use(morgan('dev'));

//  ROUTER
app.use('/auth', authRouter);
app.use('/form', formRouter);
app.use('/answers', answerRouter);
app.use('/responses', responseRouter);

// ERROR HANDLER
app.use(errorHandler);

// SERVER LISTEN
app.listen(env.PORT, () =>
  console.log('server is running on port ' + env.PORT)
);
