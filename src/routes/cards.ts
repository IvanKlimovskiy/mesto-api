import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/cards';
import { jwtRegEx } from '../constants';

const cardsRouter = Router();

cardsRouter.get(
  '/cards',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  getCards
);
cardsRouter.post(
  '/cards',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().regex(jwtRegEx),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
      owner: Joi.string().alphanum().length(24),
      likes: Joi.array(),
      createdAt: Joi.date(),
    }),
  }),
  createCard
);
cardsRouter.put(
  '/cards/likes/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  likeCard
);
cardsRouter.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  deleteCard
);
cardsRouter.delete(
  '/cards/likes/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  dislikeCard
);

export default cardsRouter;
