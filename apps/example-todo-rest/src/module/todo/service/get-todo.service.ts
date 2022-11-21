import { GetByIdRestRequestParams } from '@nx-ms/common';
import { TodoModel } from '@nx-ms/example-todo-shared/src/models/todo.model';
import {
  InternalServerErrorException,
  throwOnMongoBuilderQueryResultError,
} from '@nx-ms/ms-composition';

export class GetTodoService {
  public async handle(params: GetByIdRestRequestParams) {
    if (!params.id) {
      throw new InternalServerErrorException('Invalid request');
    }

    const res = await TodoModel().createQueryBuilder().filterObjectId(params.id).findOne();
    throwOnMongoBuilderQueryResultError(res);

    if (!res.data._id) {
      throw new InternalServerErrorException('Record not found');
    }

    return res.data;
  }
}
