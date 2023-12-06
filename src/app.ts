import express, { Response, Request, NextFunction } from 'express';
import { celebrate, errors, Joi } from 'celebrate';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './middlewares/auth';
import { PORT_DB, PORT, DB_NAME, NOT_FOUND_CODE } from './constants';
import cardsRouter from './routes/cards';
import userRouter from './routes/users';
import { createUser, login } from './controllers/users';
import { ErrorStatusCode } from './types';
import { errorLogger, requestLogger } from './middlewares/logger';

mongoose.connect(`mongodb://127.0.0.1:${PORT_DB}/${DB_NAME}`);

const app = express();

app.use(express.static('./public'));
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);

app.use('/', cardsRouter);
app.use('/', userRouter);

app.use('*', (req: Request, res: Response) => {
  res.status(NOT_FOUND_CODE).send('Страница не найдена');
});

app.use(errors());

app.use(errorLogger);

app.use((err: ErrorStatusCode, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту!`);
});
