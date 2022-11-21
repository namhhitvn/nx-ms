import {
  CreateTodoRestRequest,
  CreateTodoRestRequestResponse,
} from '@nx-ms/example-todo-shared/src/rest/todo';
import { RestController } from '@nx-ms/ms-composition';
import { CreateTodoService } from '../service/create-todo.service';

export class CreateTodoController extends RestController<typeof CreateTodoRestRequest> {
  public async handle(): Promise<void> {
    const res = await new CreateTodoService().handle(this.req.body);
    this.response(new CreateTodoRestRequestResponse(res));
  }
}
