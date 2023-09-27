import { Schema, model } from 'mongoose';
import { Card } from '../types';

const { ObjectId } = Schema.Types;

const cardSchema = new Schema<Card>({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: [ObjectId],
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<Card>('сard', cardSchema);
