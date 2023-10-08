import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserModel } from '../types';

const userSchema = new Schema<User, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив-Кусто',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationLink: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://tvcenter.ru/wp-content/uploads/2021/02/image-4.jpg',
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email });
  if (!user) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new Error('Неправильные почта или пароль'));
  }
  return user;
});

export default model<User, UserModel>('user', userSchema);
