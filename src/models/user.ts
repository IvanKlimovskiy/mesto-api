import { Schema, model } from 'mongoose';

import { User } from '../types';

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default model<User>('user', userSchema);
