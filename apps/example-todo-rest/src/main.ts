import { appBootstrap, MSRestResponseInterceptor } from '@nx-ms/ms-composition';

import todoRest from './module/todo/todo-router';

const app = appBootstrap({
  useRouters: [todoRest],
  useInterceptors: [new MSRestResponseInterceptor()],
});

export default app;
