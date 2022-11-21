import { TodoModel } from '@nx-ms/example-todo-shared/src/models/todo.model';
import {
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '@nx-ms/ms-composition';
import { GetByIdRestRequestParams } from '@nx-ms/common';
import { UpdateTodoRestRequestBody } from '@nx-ms/example-todo-shared/src/rest/todo';

export class UpdateTodoService {
  public async handle(params: GetByIdRestRequestParams, body: UpdateTodoRestRequestBody) {
    if (!params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel()
      .createQueryBuilder()
      .filterObjectId(params.id)
      .values(body)
      .update();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
