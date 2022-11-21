import {
  getConstructorName,
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestRequestRepositoryMetadata,
  instanceOfDeep,
} from '@nx-ms/common';
import { FatalErrorException } from '../../exception';
import { MSCore } from '../../interfaces';
import { BaseController } from '../controller.base';
import { MSRouter, MSRouterOptions } from '../router';
import { RestController } from './rest.controller';

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

export type MSRestRequestHandleParameters<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>
> = Parameters<MSRestRequestHandle<T, Locals>>;

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
    Locals extends Record<string, any> = Record<string, any>,
    Controller extends typeof RestController<any> = typeof RestController
  >(rest: T, ...handlers: Array<MSRestRequestHandle<T, Locals> | Controller>): this {
    const metadata = HttpRestRequestRepository.get(rest);
    if (!metadata) {
      throw new FatalErrorException(
        `HttpRestRequestRepository not exist ${getConstructorName(rest)}`
      );
    }

    // console.log(
    //   `router handle -> ${(
    //     httpRestRequestMethodMap[metadata!.method!].toUpperCase() + '      '
    //   ).slice(0, 6)} - ${metadata!.path}`
    // );

    (this.router as any)[httpRestRequestMethodMap[metadata!.method!]](
      metadata!.path,
      <MSRestRequestHandle<T, Locals>>function (req, _res, next) {
        req.restMetadata = metadata;
        next();
      },
      ...handlers.map((handle) => {
        if (!instanceOfDeep(handle, RestController)) {
          return async (req: any, res: any, next: any) => {
            try {
              return await Promise.resolve((handle as any)(req, res, next));
            } catch (error) {
              next(error);
            }
          };
        }

        return async (req: any, res: any, next: any) => {
          try {
            await (new (handle as any)(req, res, next) as RestController<any>).handle();
          } catch (error) {
            next(error);
          }
        };
      })
    );
    return this;
  }
}
