import { TodoModel } from '@nx-ms/example-todo-shared/src/models/todo.model';
import { CreateTodoRestRequestBody } from '@nx-ms/example-todo-shared/src/rest/todo';
import { throwOnMongoBuilderQueryResultError } from '@nx-ms/ms-composition';

export class CreateTodoService {
  public async handle(body: CreateTodoRestRequestBody) {
    const res = await TodoModel().createQueryBuilder().values(body).insert();
    throwOnMongoBuilderQueryResultError(res);
    return res.data;
  }
}
