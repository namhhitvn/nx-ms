import { MSRouterRest } from '@nx-ms/ms-composition/src/http';
import { HttpRestRequestRepository, HttpRestRequest, HttpRestResponse } from '@nx-ms/common';

class Todo {
  public name!: string;
}

class ListTodoRestRequestResponse extends HttpRestResponse<Todo[]> {}

class ListTodoRestRequestQuery {
  public keyword?: string;
}

@HttpRestRequestRepository({
  path: '/api/v1/todos',
  Response: ListTodoRestRequestResponse,
  Query: ListTodoRestRequestQuery,
})
class ListTodoRestRequest extends HttpRestRequest<
  typeof ListTodoRestRequestResponse,
  undefined,
  undefined,
  typeof ListTodoRestRequestQuery
> {}

export const todoRest = new MSRouterRest();

todoRest.handle(ListTodoRestRequest, (req, res, next) => {
  res.json(new ListTodoRestRequestResponse([{ name: 'Hello world' }]));
});

export default todoRest;
