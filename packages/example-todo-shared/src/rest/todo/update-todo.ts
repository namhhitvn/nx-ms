import {
  GetByIdRestRequestParams,
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestResponse,
} from '@nx-ms/common';
import { Todo } from '../../interfaces';

export class UpdateTodoRestRequestResponse extends HttpRestResponse<Todo> {}

export class UpdateTodoRestRequestBody extends Todo {}

@HttpRestRequestRepository({
  path: '/api/v1/todos/:id',
  method: HttpRequestMethod.PUT,
  Response: UpdateTodoRestRequestResponse,
  Params: GetByIdRestRequestParams,
  Body: UpdateTodoRestRequestBody,
})
export class UpdateTodoRestRequest extends HttpRestRequest<
  typeof UpdateTodoRestRequestResponse,
  typeof GetByIdRestRequestParams,
  typeof UpdateTodoRestRequestBody
> {}
