import { TodoModel } from '@nx-ms/example-todo-shared/src/models/todo.model';
import {
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '@nx-ms/ms-composition';
import { GetByIdRestRequestParams } from '@nx-ms/common';

export class DeleteTodoService {
  public async handle(params: GetByIdRestRequestParams) {
    if (!params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel().createQueryBuilder().filterObjectId(params.id).softDelete();
    throwOnMongoBuilderQueryResultError(res);

    return res.data;
  }
}
