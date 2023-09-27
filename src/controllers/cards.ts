import { Response, Request } from 'express';

import { ERROR_CODE, INCORECT_DATA_CODE, NOT_FOUND_CODE } from '../constants/constants';

import { CardBody } from '../types';

import Card from '../models/card';

const createCard = (req: Request, res: Response) => {
  const owner = req.user._id;
  const { name, link }: CardBody = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      if (card) {
        res.json({
          status: 'success',
          data: {
            card,
          },
        });
      } else {
        res.status(INCORECT_DATA_CODE).send({ message: 'Введены некорректные данные!' });
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

const getCards = (req: Request, res: Response) => {
  Card.find()
    .then((cards) => {
      if (cards) {
        res.json({
          status: 'success',
          data: {
            cards,
          },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточки не найдены' });
      }
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (card) {
        res.json({
          status: 'success',
          data: {
            card,
          },
        });
      } else {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточка не найдена' });
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

const likeCard = (req: Request, res: Response) => {
  const likedUserId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: likedUserId } }, { new: true })
    .then((card) => {
      if (card) {
        res.json({
          status: 'success',
          data: {
            card,
          },
        });
      } else {
        res.status(INCORECT_DATA_CODE).send({ message: 'Карточка не найдена' });
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

const dislikeCard = (req: Request, res: Response) => {
  const likedUserId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: likedUserId } }, { new: true })
    .then((card) => {
      if (card) {
        res.json({
          status: 'success',
          data: {
            card,
          },
        });
      } else {
        res.status(INCORECT_DATA_CODE).send({ message: 'Карточка не найдена' });
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

export { getCards, createCard, deleteCard, likeCard, dislikeCard };
