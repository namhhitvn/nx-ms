import { forceArray, forceString } from '@nx-ms/common';
import { isArray, isObject } from 'lodash';
import mongoose from 'mongoose';
import type { BaseMongoModel } from './mongo-model.base';

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type MongoBuilderSort<T> = Partial<{ [key in keyof T]: mongoose.SortOrder }>;
type MongoBuilderFilterDynamic<
  T,
  K,
  F = K extends `filter${infer field}` ? Uncapitalize<field> : never,
  A = Extract<F, string> extends keyof T ? T[Extract<F, string>] : 0
> = 0 extends A
  ? () => IMongoBuilder<T>
  : boolean extends A
  ? (val?: A) => IMongoBuilder<T>
  : string extends A
  ? (val: A | RegExp | RequireOnlyOne<mongoose.QuerySelector<A>>) => IMongoBuilder<T>
  : (val: A | RequireOnlyOne<mongoose.QuerySelector<A>>) => IMongoBuilder<T>;

export type IMongoBuilder<T, ResultDoc = mongoose.HydratedDocument<T>> = {
  setQuery(filterQuery: mongoose.FilterQuery<T>): IMongoBuilder<T>;
  reset(): IMongoBuilder<T>;
  filterObjectId(_id: string): IMongoBuilder<T>;
  filterIds(ids: string | string[], field?: keyof T, separator?: string): IMongoBuilder<T>;
  sort(sortConditions: MongoBuilderSort<T>): IMongoBuilder<T>;
  setPage(page: number, limit: number): IMongoBuilder<T>;
  setSkip(skip: number): IMongoBuilder<T>;
  setLimit(limit: number): IMongoBuilder<T>;
  selectFields<ResultDoc = mongoose.HydratedDocument<T>>(
    select: mongoose.ProjectionType<T>
  ): IMongoBuilder<T, ResultDoc>;
  setLean<T extends boolean>(val: T): IMongoBuilder<T>;
  values(val: Partial<T> | Partial<T>[]): IMongoBuilder<T>;
  find(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>>;
  count(): Promise<MongoBuilderQueryResult<number>>;
  findAndCount(): Promise<MongoBuilderQueryResult<[Array<ResultDoc>, number]>>;
  findOne(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  update(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  /** @deprecated need implement */
  updateMany(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>>;
  upsert(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  /** @deprecated need implement */
  upsertMany(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>>;
  insert(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  /** @deprecated need implement */
  insertMany(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>>;
  softDelete(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  /** @deprecated need implement */
  softDeleteMany(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  restore(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  /** @deprecated need implement */
  restoreMany(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  delete(): Promise<MongoBuilderQueryResult<ResultDoc>>;
  /** @deprecated need implement */
  deleteMany(): Promise<MongoBuilderQueryResult<ResultDoc>>;
} & {
  [key in `filter${Capitalize<
    Exclude<Extract<keyof T, string>, '_id'>
  >}`]: MongoBuilderFilterDynamic<T, key>;
};

export function throwOnMongoBuilderQueryResultError(result: MongoBuilderQueryResult<any>) {
  if (result.error) {
    throw result.error;
  }
}

export class MongoBuilder<T, ResultDoc = mongoose.HydratedDocument<T>> {
  private readonly model: BaseMongoModel<T>;

  private _values: Partial<T>[] = [];
  private _query: mongoose.FilterQuery<T> = {};
  private _sort: MongoBuilderSort<T> = {};
  private _skip = 0;
  private _lean = true;
  private _limit = 50;
  private _select?: mongoose.ProjectionType<T> = undefined;

  constructor(model: BaseMongoModel<T>) {
    this.model = model;

    this.generateFilter();
  }

  private generateFilter() {
    for (const key of Object.keys(this.model.getModel().schema.obj)) {
      const methodName = 'filter' + key.charAt(0).toUpperCase() + key.slice(1);

      if ((this.model.getModel().schema.obj as any)?.[key]?.type === Boolean) {
        Object.defineProperty(this, methodName, {
          value: (val: any) => this.query({ [key as any]: val !== false }),
        });

        continue;
      }

      Object.defineProperty(this, methodName, {
        value: (val: any) => this.query({ [key as any]: val }),
      });
    }
  }

  private query(filterQuery: mongoose.FilterQuery<T>): this {
    const listCond = ['$or', '$and', '$inc', '$nor'];
    for (const field in filterQuery) {
      if (listCond.includes(field)) {
        if (!this._query[field]) {
          (this as any).filterQuery[field] = filterQuery[field];
        } else {
          if (isArray(this._query[field])) {
            (this as any).filterQuery[field] = [...this._query[field], ...filterQuery[field]];
          } else if (isObject(this._query[field])) {
            (this as any).filterQuery[field] = {
              ...this._query[field],
              ...filterQuery[field],
            };
          }
        }
      } else {
        this._query = { ...this._query, ...filterQuery };
      }
    }
    return this;
  }

  public setQuery(filterQuery: mongoose.FilterQuery<T>): this {
    this.query(filterQuery);
    return this;
  }

  public reset(): this {
    this._query = {};
    return this;
  }

  public filterObjectId(_id: string): this {
    const id = this.model.parseObjectId(_id);
    this.query({ _id: id });
    return this;
  }

  public filterIdss(
    ids?: string | string[],
    field: keyof T = '_id' as keyof T,
    separator = ','
  ): this {
    if (typeof ids === 'string') ids = ids.split(separator);
    ids = forceArray(ids!).filter((item: string) => forceString(item) !== '');
    ids = ids!.map((item: string) => this.model.parseObjectId(item.trim()));
    this.setQuery({ [field]: { $in: ids } } as any);
    return this;
  }

  public sort(sortConditions: MongoBuilderSort<T>): this {
    this._sort = { ...this._sort, ...sortConditions };
    return this;
  }

  public setPage(page: number, limit: number): this {
    this._skip = page * limit;
    this._limit = limit;
    return this;
  }

  public setSkip(skip: number): this {
    this._skip = skip;
    return this;
  }

  public setLimit(limit: number): this {
    this._limit = limit;
    return this;
  }

  public setLean<T extends boolean>(val: T): this {
    this._lean = val;
    return this;
  }

  public values(val: Partial<T> | Partial<T>[]): this {
    this._values.push(...(Array.isArray(val) ? val : [val]));
    return this;
  }

  public selectFields<ResultDoc = mongoose.HydratedDocument<T>>(
    select: mongoose.ProjectionType<T>
  ): MongoBuilder<T, ResultDoc> {
    if (typeof select === 'string') {
      this._select = select;
    } else if (typeof this._select === 'string') {
      this._select = select;
    } else {
      this._select = {
        ...this._select,
        ...select,
      };
    }
    return this as unknown as MongoBuilder<T, ResultDoc>;
  }

  async find(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>> {
    return new Promise((resolve) => {
      try {
        const list: any = [];
        this.model
          .getModel()
          .find(this._query)
          .skip(this._skip)
          .limit(this._limit)
          .select(this._select)
          .sort(this._sort as any)
          .lean(this._lean)
          .cursor()
          .on('data', (val: any) => list.push(this.getDocument(val)))
          .on('end', () => resolve(new MongoBuilderQueryResult<any>(list)))
          .on('error', (err) => resolve(new MongoBuilderQueryResult<any>([], err)));
      } catch (error: any) {
        return new MongoBuilderQueryResult<any>([], error);
      }
    });
  }

  async count(): Promise<MongoBuilderQueryResult<number>> {
    try {
      const count = await this.model.getModel().countDocuments(this._query);
      return new MongoBuilderQueryResult(count);
    } catch (error: any) {
      return new MongoBuilderQueryResult(0, error);
    }
  }

  async findAndCount(): Promise<MongoBuilderQueryResult<[Array<ResultDoc>, number]>> {
    try {
      const count = await this.count();
      throwOnMongoBuilderQueryResultError(count);
      const list = await this.find();
      throwOnMongoBuilderQueryResultError(list);
      return new MongoBuilderQueryResult([list.data, count.data]);
    } catch (error: any) {
      return new MongoBuilderQueryResult([[], 0], error);
    }
  }

  async findOne(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    try {
      const val = await this.model
        .getModel()
        .findOne(this._query)
        .select(this._select)
        .lean(this._lean)
        .exec();
      return new MongoBuilderQueryResult(this.getDocument(val));
    } catch (error: any) {
      return new MongoBuilderQueryResult({} as any, error);
    }
  }

  async update(options?: mongoose.QueryOptions<T>): Promise<MongoBuilderQueryResult<ResultDoc>> {
    try {
      const value: any = this._values[0];
      delete value?._id;
      const val = await this.model
        .getModel()
        .findOneAndUpdate(this._query, value, {
          new: true,
          ...options,
        })
        .select(this._select)
        .lean(this._lean)
        .exec();
      return new MongoBuilderQueryResult(this.getDocument(val));
    } catch (error: any) {
      return new MongoBuilderQueryResult({} as any, error);
    }
  }

  async updateMany(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  async upsert(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  async upsertMany(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  async insert(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    try {
      const doc = this.model.newModel({ ...this._values[0] });
      const val: any = await doc.save();
      return new MongoBuilderQueryResult(this.getDocument(val));
    } catch (error: any) {
      return new MongoBuilderQueryResult({} as any, error);
    }
  }

  async insertMany(): Promise<MongoBuilderQueryResult<Array<ResultDoc>>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  async softDelete(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    try {
      const val = await this.model
        .getModel()
        .findOneAndUpdate(this._query, { deletedAt: new Date() }, { new: true })
        .select(this._select)
        .lean(this._lean)
        .exec();
      return new MongoBuilderQueryResult(this.getDocument(val));
    } catch (error: any) {
      return new MongoBuilderQueryResult({} as any, error);
    }
  }

  async softDeleteMany(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  async restore(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    try {
      const val = await this.model
        .getModel()
        .findOneAndUpdate(this._query, { $unset: { deletedAt: 1 } }, { new: true })
        .select(this._select)
        .lean(this._lean)
        .exec();
      return new MongoBuilderQueryResult(this.getDocument(val));
    } catch (error: any) {
      return new MongoBuilderQueryResult({} as any, error);
    }
  }

  async restoreMany(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  async delete(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    try {
      const val: any = await this.model.getModel().remove(this._query);
      return new MongoBuilderQueryResult(this.getDocument(val));
    } catch (error: any) {
      return new MongoBuilderQueryResult({} as any, error);
    }
  }

  async deleteMany(): Promise<MongoBuilderQueryResult<ResultDoc>> {
    // TODO: [MongoBuilder] - implement method
    return {} as any;
  }

  private getDocument(val: any, def?: any) {
    return val?._doc ?? val ?? (def || {});
  }
}

class MongoBuilderQueryResult<T> {
  constructor(public data: T, public error?: Error) {}
}
