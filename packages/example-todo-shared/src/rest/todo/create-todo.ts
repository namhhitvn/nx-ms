import {
  HttpRequestMethod,
  HttpRestRequest,
  HttpRestRequestRepository,
  HttpRestResponse,
} from '@nx-ms/common';
import { Todo } from '../../interfaces';

export class CreateTodoRestRequestResponse extends HttpRestResponse<Todo> {}

export class CreateTodoRestRequestBody extends Todo {}

@HttpRestRequestRepository({
  path: '/api/v1/todos',
  method: HttpRequestMethod.POST,
  Response: CreateTodoRestRequestResponse,
  Body: CreateTodoRestRequestBody,
})
export class CreateTodoRestRequest extends HttpRestRequest<
  typeof CreateTodoRestRequestResponse,
  undefined,
  typeof CreateTodoRestRequestBody
> {}
