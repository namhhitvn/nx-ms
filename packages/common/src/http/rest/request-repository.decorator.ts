import { HttpRequestMethod } from '../../constants';
import { IHttpRestRequestWithArgs, HttpRestRequest } from './request';

interface HttpRestRequestRepositoryOptions<
  Response extends Constructor,
  Params extends undefined | Constructor = undefined,
  Body extends undefined | Constructor = undefined,
  Query extends undefined | Constructor = undefined,
  File extends undefined | Constructor = undefined
> {
  path: string;
  method?: HttpRequestMethod;
  Response: Response;
  Params?: Params;
  Body?: Body;
  Query?: Query;
  File?: File;
}

export interface HttpRestRequestRepositoryMetadata<
  Clazz extends typeof HttpRestRequest<Response, Params, Body, Query, File>,
  Response extends Constructor = InstanceType<Clazz>['Response'],
  Params extends undefined | Constructor = InstanceType<Clazz>['Params'],
  Body extends undefined | Constructor = InstanceType<Clazz>['Body'],
  Query extends undefined | Constructor = InstanceType<Clazz>['Query'],
  File extends undefined | Constructor = InstanceType<Clazz>['File']
> extends HttpRestRequestRepositoryOptions<Response, Params, Body, Query, File> {
  constructor: Clazz;
}

interface IHttpRestRequestRepository {
  <
    Response extends Constructor,
    Params extends undefined | Constructor = undefined,
    Body extends undefined | Constructor = undefined,
    Query extends undefined | Constructor = undefined,
    File extends undefined | Constructor = undefined
  >(
    options: HttpRestRequestRepositoryOptions<Response, Params, Body, Query, File>
  ): <T extends IHttpRestRequestWithArgs<Response, Params, Body, Query, File>>(
    Target: T
  ) => IHttpRestRequestWithArgs<Response, Params, Body, Query, File>;

  has<Clazz extends typeof HttpRestRequest<any, any, any, any, any>>(
    target: Clazz | InstanceType<Clazz>
  ): boolean;

  get<Clazz extends typeof HttpRestRequest<any, any, any, any, any>>(
    target: Clazz | InstanceType<Clazz>
  ): undefined | HttpRestRequestRepositoryMetadata<Clazz>;
}

const httpRestRequestRepository = new Map<any, any>();

export const HttpRestRequestRepository = ((
  options: HttpRestRequestRepositoryOptions<any, any, any, any, any>
) => {
  return (Target: any) => {
    if (httpRestRequestRepository.has(Target)) {
      return;
    }

    httpRestRequestRepository.set(Target, {
      method: HttpRequestMethod.GET,
      ...options,
      constructor: Target,
    });
  };
}) as IHttpRestRequestRepository;

HttpRestRequestRepository.has = (target: any) => {
  return !!HttpRestRequestRepository.get(target);
};

HttpRestRequestRepository.get = (target: any) => {
  return (
    httpRestRequestRepository.get(target) ||
    httpRestRequestRepository.get(target.prototype || target.__proto__)
  );
};
