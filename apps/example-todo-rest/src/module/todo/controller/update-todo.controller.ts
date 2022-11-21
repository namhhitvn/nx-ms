import {
  UpdateTodoRestRequest,
  UpdateTodoRestRequestResponse,
} from '@nx-ms/example-todo-shared/src/rest/todo';
import { RestController } from '@nx-ms/ms-composition';
import { UpdateTodoService } from '../service/update-todo.service';

export class UpdateTodoController extends RestController<typeof UpdateTodoRestRequest> {
  public async handle(): Promise<void> {
    const res = await new UpdateTodoService().handle(this.req.params, this.req.body);
    this.response(new UpdateTodoRestRequestResponse(res));
  }
}
