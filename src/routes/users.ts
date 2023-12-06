import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { getCurrentUser, getUser, getUsers, updateAvatar, updateProfile } from '../controllers/users';
import { jwtRegEx } from '../constants';

const userRouter = Router();

userRouter.get(
  '/users',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  getUsers
);
userRouter.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  getCurrentUser
);
userRouter.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required().regex(jwtRegEx),
      })
      .unknown(true),
  }),
  getUser
);
userRouter.patch(
  '/users/me/avatar',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required().regex(jwtRegEx),
      })
      .unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  updateAvatar
);
userRouter.patch(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required().regex(jwtRegEx),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  updateProfile
);

export default userRouter;
