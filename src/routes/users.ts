import { Router } from 'express';

import { createUser } from '../controllers/users';

const userRouter = Router();

userRouter.post('/users/', createUser);

export default userRouter;
