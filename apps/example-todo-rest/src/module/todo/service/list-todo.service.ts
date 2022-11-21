import { ListTodoRestRequestQuery } from '@nx-ms/example-todo-shared/src/rest/todo/list-todo';
import { TodoModel } from '@nx-ms/example-todo-shared/src/models/todo.model';
import { throwOnMongoBuilderQueryResultError } from '@nx-ms/ms-composition';

export class ListTodoService {
  public async handle(query: ListTodoRestRequestQuery) {
    const qb = TodoModel().createQueryBuilder();

    if (query.keyword) {
      qb.filterTitle(new RegExp(query.keyword, 'gi'));
    }

    const res = await qb.find();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
