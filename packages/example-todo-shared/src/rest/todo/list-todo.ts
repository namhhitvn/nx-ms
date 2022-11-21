import { HttpRestRequest, HttpRestRequestRepository, HttpRestResponse } from '@nx-ms/common';
import { Todo } from '../../interfaces';

export class ListTodoRestRequestResponse extends HttpRestResponse<Todo[]> {}

export class ListTodoRestRequestQuery {
  public keyword?: string;
}

@HttpRestRequestRepository({
  path: '/api/v1/todos',
  Response: ListTodoRestRequestResponse,
  Query: ListTodoRestRequestQuery,
})
export class ListTodoRestRequest extends HttpRestRequest<
  typeof ListTodoRestRequestResponse,
  undefined,
  undefined,
  typeof ListTodoRestRequestQuery
> {}
