import mongoose from 'mongoose';
import { Todo } from '../interfaces';
import { BaseMongoModel } from '@nx-ms/ms-composition/src/mongo/mongo-model.base';

const TodoSchema = new mongoose.Schema<Todo>(
  {
    title: { type: String },
    active: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

class _TodoModel extends BaseMongoModel<Todo> {
  constructor(connectionName?: string) {
    super('Todo', TodoSchema, connectionName);
  }
}

export const TodoModel = (connectionName?: string) => new _TodoModel(connectionName);
