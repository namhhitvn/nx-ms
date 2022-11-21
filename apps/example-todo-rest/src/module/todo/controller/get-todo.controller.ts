import {
  GetTodoRestRequest,
  GetTodoRestRequestResponse,
} from '@nx-ms/example-todo-shared/src/rest/todo';
import { RestController } from '@nx-ms/ms-composition';
import { GetTodoService } from '../service/get-todo.service';

export class GetTodoController extends RestController<typeof GetTodoRestRequest> {
  public async handle(): Promise<void> {
    const res = await new GetTodoService().handle(this.req.params);
    this.response(new GetTodoRestRequestResponse(res));
  }
}
