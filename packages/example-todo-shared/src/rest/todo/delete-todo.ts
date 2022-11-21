import {
  GetByIdRestRequestParams,
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  RestRequestResponseOK,
} from '@nx-ms/common';

@HttpRestRequestRepository({
  path: '/api/v1/todos/:id',
  method: HttpRequestMethod.DELETE,
  Response: RestRequestResponseOK,
  Params: GetByIdRestRequestParams,
})
export class DeleteTodoRestRequest extends HttpRestRequest<
  typeof RestRequestResponseOK,
  typeof GetByIdRestRequestParams
> {}
