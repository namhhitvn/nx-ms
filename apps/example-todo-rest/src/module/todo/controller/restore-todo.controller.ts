import { RestRequestResponseOK } from '@nx-ms/common';
import { RestoreTodoRestRequest } from '@nx-ms/example-todo-shared/src/rest/todo';
import { RestController } from '@nx-ms/ms-composition';
import { RestoreTodoService } from '../service/restore-todo.service';

export class RestoreTodoController extends RestController<typeof RestoreTodoRestRequest> {
  public async handle(): Promise<void> {
    await new RestoreTodoService().handle(this.req.params);
    this.response(new RestRequestResponseOK());
  }
}
