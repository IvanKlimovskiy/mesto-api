import express from 'express';
import mongoose from 'mongoose';
import { PORT_DB, PORT, DB_NAME, NOT_FOUND_CODE } from './constants/constants';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65143e484468a805ab8d2e0c',
  };
  next();
});

app.use('/', cardRouter);
app.use('/', userRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send('Страница не найдена');
});

const start = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:${PORT_DB}/${DB_NAME}`).then(() => {
      console.log('Database connect');
    });
    app.listen(PORT, () => {
      console.log(`Server start on ${PORT} port!`);
    });
  } catch (err) {
    console.log(err);
  }
};

start().then();
