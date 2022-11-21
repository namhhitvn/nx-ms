import mongoose from 'mongoose';
import { FatalErrorException } from '../exception';
import { IMongoBuilder, MongoBuilder } from './mongo-builder';
import { ConnectMongoStore } from './mongo.connector';

export abstract class BaseMongoModel<T> {
  private readonly model: mongoose.Model<T>;
  private readonly connection: mongoose.Connection;

  constructor(modelName: string, schema: mongoose.Schema<T>, connectionName?: string) {
    this.connection = ConnectMongoStore.getConnection(connectionName || 'default')!;

    if (!this.connection) {
      throw new FatalErrorException(
        `Have an error when during initialization ${this.constructor.name}`
      );
    }

    this.model = this.connection.model(modelName, schema, modelName) as mongoose.Model<T>;
  }

  public createQueryBuilder(): IMongoBuilder<T> {
    return new MongoBuilder<T>(this) as unknown as IMongoBuilder<T>;
  }

  public getModel() {
    return this.model;
  }

  public newModel(doc: Partial<T>, fields?: any | null, options?: boolean | mongoose.AnyObject) {
    return new this.model(doc, fields, options);
  }

  public parseObjectId(_id: string): any {
    try {
      return new mongoose.Types.ObjectId(_id);
    } catch (error) {
      return null;
    }
  }
}
