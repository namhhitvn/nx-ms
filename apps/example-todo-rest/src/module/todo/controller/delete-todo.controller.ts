import { RestRequestResponseOK } from '@nx-ms/common';
import { DeleteTodoRestRequest } from '@nx-ms/example-todo-shared/src/rest/todo';
import { RestController } from '@nx-ms/ms-composition';
import { DeleteTodoService } from '../service/delete-todo.service';

export class DeleteTodoController extends RestController<typeof DeleteTodoRestRequest> {
  public async handle(): Promise<void> {
    await new DeleteTodoService().handle(this.req.params);
    this.response(new RestRequestResponseOK());
  }
}
