import { HttpRequestMethod, HttpRestRequest } from '@nx-ms/common';
import * as express from 'express';
import { MSCore } from '../interfaces';

export interface HttpRestOptions extends express.RouterOptions {
  enable?: boolean;
  path?: string;
}

const httpRestRequestMethodMap: {
  [key in HttpRequestMethod]:
    | 'all'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'options'
    | 'head';
} = {
  [HttpRequestMethod.ALL]: 'all',
  [HttpRequestMethod.GET]: 'get',
  [HttpRequestMethod.POST]: 'post',
  [HttpRequestMethod.PUT]: 'put',
  [HttpRequestMethod.DELETE]: 'delete',
  [HttpRequestMethod.PATCH]: 'patch',
  [HttpRequestMethod.OPTIONS]: 'options',
  [HttpRequestMethod.HEAD]: 'head',
};

export class HttpRest {
  public readonly router!: express.Router;

  constructor(public readonly options: HttpRestOptions) {
    this.router = express.Router(options);
  }

  public assignRouter(app: express.Express) {
    if (this.options.enable === false) {
      return;
    }

    if (this.options.path) {
      app.use(this.options.path, this.router);
    } else {
      app.use(this.router);
    }
  }

  public handle<
    T extends Constructor<HttpRestRequest<any, any, any, any, any>>,
    Locals extends Record<string, any> = Record<string, any>
  >(
    rest: T,
    ...handlers: Array<
      MSCore.RequestHandler<
        InstanceType<InstanceType<T>['Response']>,
        InstanceType<InstanceType<T>['Params']>,
        InstanceType<InstanceType<T>['Body']>,
        InstanceType<InstanceType<T>['Query']>,
        Locals
      >
    >
  ): this {
    this.router[httpRestRequestMethodMap[rest.prototype.method]](rest.prototype.path, ...handlers);
    return this;
  }
}
