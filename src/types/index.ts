import { Model, Document, Schema } from 'mongoose';

const { ObjectId } = Schema.Types;
export interface Card {
  name: String;
  link: String;
  owner: typeof ObjectId;
  likes: (typeof ObjectId)[];
  createdAt: Date;
}

export interface User {
  name: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
  about: string;
  avatar: string;
}

export interface UserModel extends Model<User> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<User>>;
}

export interface CardBody {
  name: string;
  link: string;
  owner: string;
  likes: string[];
  createdAt: string;
}

export interface UserBodyRequest {
  name: string;
  email: string;
  password: string;
  isActivated: boolean;
  about: string;
  avatar: string;
}

export interface ErrorStatusCode extends Error {
  statusCode: number;
}
