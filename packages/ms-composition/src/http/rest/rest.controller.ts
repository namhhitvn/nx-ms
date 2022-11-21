import { MSRestRequestHandleParameters } from './router-rest';
import { HttpRestRequest } from '@nx-ms/common/src/http/rest/request';
import { BaseController } from '../controller.base';

export abstract class RestController<
  T extends typeof HttpRestRequest<any, any, any, any, any>,
  Locals extends Record<string, any> = Record<string, any>,
  Params extends MSRestRequestHandleParameters<T, Locals> = MSRestRequestHandleParameters<
    T,
    Locals
  >,
  Response = InstanceType<InstanceType<T>['Response']>
> extends BaseController<Params, Response> {}
