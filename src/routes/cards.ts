import { Router } from 'express';
import { getCards, createCard, deleteCard, likeCard, dislikeCard } from '../controllers/cards';

const cardRouter = Router();

cardRouter.route('/cards').get(getCards).post(createCard);
cardRouter.route('/cards/:cardId/likes').put(likeCard);
cardRouter.route('/cards/:cardId').delete(deleteCard);
cardRouter.route('/cards/:cardId/likes').delete(dislikeCard);

export default cardRouter;
