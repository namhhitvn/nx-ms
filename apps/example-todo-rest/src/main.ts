import { appBootstrap, MSRestResponseInterceptor } from '@nx-ms/ms-composition';

import todoRest from './module/todo/todo-router';

appBootstrap({
  useRouters: [todoRest],
  useInterceptors: [new MSRestResponseInterceptor()],
});
