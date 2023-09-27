import { Schema } from 'mongoose';

const { ObjectId } = Schema.Types;
export type Card = {
  name: String;
  link: String;
  owner: typeof ObjectId;
  likes: (typeof ObjectId)[];
  createdAt: Date;
};

export type User = {
  name: String;
  about: String;
  avatar: String;
};

export type CardBody = {
  name: String;
  link: String;
  owner: String;
  likes: String[];
  createdAt: String;
};

export type UserBody = {
  name: String;
  about: String;
  avatar: String;
};
