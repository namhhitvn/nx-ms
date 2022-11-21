import { appBootstrap, connectMongo, MSRestResponseInterceptor } from '@nx-ms/ms-composition';

import todoRest from './module/todo/todo-router';

const app = appBootstrap(
  {
    useRouters: [todoRest],
    useInterceptors: [new MSRestResponseInterceptor()],
  },
  () => {
    if (process.env['MONGO_URI']) {
      connectMongo({
        uri: process.env['MONGO_URI'],
        connectOptions: {
          user: process.env['MONGO_USER'],
          pass: process.env['MONGO_PASS'],
          dbName: process.env['MONGO_NAME'],
        },
      });
    }
  }
);

export default app;
