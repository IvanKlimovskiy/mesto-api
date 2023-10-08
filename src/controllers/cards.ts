import { Response, Request, NextFunction } from 'express';
import { CardBody } from '../types';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error';
import IncorrectData from '../errors/incorrect-data';
import { handleErrors } from '../utils';

const createCard = (req: Request, res: Response, next: NextFunction) => {
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
        throw new IncorrectData('Введены некорректные данные!');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const getCards = (req: Request, res: Response, next: NextFunction) => {
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
        throw new NotFoundError('Карточки не найдены');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const deleteCard = (req: Request, res: Response, next: NextFunction) => {
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
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const likeCard = (req: Request, res: Response, next: NextFunction) => {
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
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const likedUserId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: likedUserId } }, { new: true })
    .then((card) => {
      if (card) {
        res.json({
          status: 'success',
          data: { card },
        });
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((error) => {
      handleErrors(error, next);
    });
};

export { getCards, createCard, deleteCard, likeCard, dislikeCard };
