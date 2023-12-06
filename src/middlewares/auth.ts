import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ServerSideError from '../errors/server-side-error';
import { JWT_SECRET } from '../controllers/users';
import UnauthorizedError from '../errors/unauthorized-error';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new UnauthorizedError('Требуется авторизация');
    return next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    if (JWT_SECRET) {
      payload = jwt.verify(token, JWT_SECRET);
    } else {
      throw new ServerSideError('Что-то пошло не так');
    }
  } catch (error) {
    return next(error);
  }

  req.user = payload as jwt.JwtPayload;

  return next();
};
