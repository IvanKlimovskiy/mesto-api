import { Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import { UserBodyRequest } from '../types';
import { handleErrors } from '../utils';
import ServerSideError from '../errors/server-side-error';
import NotFoundError from '../errors/not-found-error';
import IncorrectData from '../errors/incorrect-data';

dotenv.config();

export const { JWT_SECRET } = process.env;

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: UserBodyRequest = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (JWT_SECRET) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '15d' });
        res.json({ token: `Bearer ${token}` });
      } else {
        throw new ServerSideError('На сервере произошла ошибка');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, ...rest }: UserBodyRequest = req.body;
  const candidate = await User.findOne({ email });
  if (candidate) {
    const error = new IncorrectData(`Пользователь с таким e-mail ${email} уже существует`);
    next(error);
  } else {
    bcrypt.hash(password, 10).then((hashedPassword) => {
      const activationLink = uuidv4();
      User.create({ email, password: hashedPassword, activationLink, ...rest })
        .then((user) => {
          if (JWT_SECRET) {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '15m' });
            if (user) {
              const { name, about, isActivated, avatar } = user;
              res
                .json({
                  status: 'success',
                  data: {
                    user: { name, about, isActivated, avatar },
                  },
                })
                .cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
            } else {
              throw new NotFoundError('Пользователь не найден');
            }
          } else {
            throw new ServerSideError('На сервере произошла ошибка');
          }
        })
        .catch((error) => {
          handleErrors(error, next);
        });
    });
  }
};

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .then((users) => {
      if (users) {
        res.json({
          status: 'success',
          data: { users },
        });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.json({ user });
      } else {
        throw new NotFoundError('Пользователи не найдены');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (user) {
        res.json({ user });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about }: UserBodyRequest = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.json({
          status: 'success',
          data: { user },
        });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar }: UserBodyRequest = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (user) {
        res.json({
          status: 'success',
          data: { user },
        });
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

export { getUser, createUser, getUsers, updateProfile, updateAvatar, login, getCurrentUser };
