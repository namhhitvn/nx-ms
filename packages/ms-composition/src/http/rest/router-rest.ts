import {
  getConstructorName,
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestRequestRepositoryMetadata,
} from '@nx-ms/common';
import { FatalErrorException } from '../../exception';
import { MSCore } from '../../interfaces';
import { MSRouter, MSRouterOptions } from '../router';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MSRouterRestOptions extends MSRouterOptions {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MSRestRequestHandle<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>
> extends MSCore.RequestHandler<
    InstanceType<InstanceType<T>['Response']>,
    InstanceType<InstanceType<T>['Params']>,
    InstanceType<InstanceType<T>['Body']>,
    InstanceType<InstanceType<T>['Query']>,
    Locals,
    { rest: HttpRestRequestRepositoryMetadata<T> }
  > {}

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

export class MSRouterRest extends MSRouter {
  constructor(options: MSRouterRestOptions = {}) {
    super(options);
  }

  public handle<
    T extends typeof HttpRestRequest<any, any, any, any, any>,
    Locals extends Record<string, any> = Record<string, any>
  >(rest: T, ...handlers: Array<MSRestRequestHandle<T, Locals>>): this {
    const metadata = HttpRestRequestRepository.get(rest);
    if (!metadata) {
      throw new FatalErrorException(
        `HttpRestRequestRepository not exist ${getConstructorName(rest)}`
      );
    }
    (this.router as any)[httpRestRequestMethodMap[metadata!.method!]](
      metadata!.path,
      <MSRestRequestHandle<T, Locals>>function (req, _res, next) {
        req.restMetadata = metadata;
        next();
      },
      ...handlers
    );
    return this;
  }
}
