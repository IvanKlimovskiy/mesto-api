import { Response, Request } from 'express';
import User from '../models/user';
import { NOT_FOUND_CODE, ERROR_CODE, INCORECT_DATA_CODE } from '../constants/constants';
import { UserBody } from '../types';

const createUser = (req: Request, res: Response) => {
  User.create(req.body)
    .then((user) => {
      if (user) {
        res.json({
          status: 'success',
          data: {
            user,
          },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(INCORECT_DATA_CODE).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const getUsers = (req: Request, res: Response) => {
  User.find()
    .then((users) => {
      if (users) {
        res.json({
          status: 'success',
          data: { users },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователи не найдены' });
      }
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.json({
          status: 'success',
          data: { user },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь не найдены' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(INCORECT_DATA_CODE).send({ message: 'Некорректный идентификатор' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateProfile = (req: Request, res: Response) => {
  const { name, about }: UserBody = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => {
      if (user) {
        res.json({
          status: 'success',
          data: { user },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь не найдены' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(INCORECT_DATA_CODE).send({ message: 'Введены некорректные данные' });
      } else if (error.name === 'CastError') {
        res.status(INCORECT_DATA_CODE).send({ message: 'Некорректный идентификатор' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req: Request, res: Response) => {
  const { avatar }: UserBody = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, avatar, {
    new: true,
  })
    .then((user) => {
      if (user) {
        res.json({
          status: 'success',
          data: { user },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь не найдены' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(INCORECT_DATA_CODE).send({ message: 'Введены некорректные данные' });
      } else if (error.name === 'CastError') {
        res.status(INCORECT_DATA_CODE).send({ message: 'Некорректный идентификатор' });
      } else {
        res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

export { getUser, createUser, getUsers, updateProfile, updateAvatar };
