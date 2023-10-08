import { NextFunction } from 'express';

import IncorrectData from '../errors/incorrect-data';

export function handleErrors(error: Error, next: NextFunction) {
  if (error.name === 'ValidationError') {
    error = new IncorrectData('Введены некорректные данные');
  } else if (error.name === 'CastError') {
    error = new IncorrectData('Некорректный идентификатор');
  }
  next(error);
}
