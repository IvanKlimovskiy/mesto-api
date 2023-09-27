import { Router } from 'express';

import { createUser, getUser, getUsers, updateAvatar, updateProfile } from '../controllers/users';

const userRouter = Router();

userRouter.route('/users').get(getUsers).post(createUser);
userRouter.route('/users/:userId').get(getUser);
userRouter.patch('/users/me/avatar', updateAvatar);
userRouter.patch('/users/me', updateProfile);
export default userRouter;
