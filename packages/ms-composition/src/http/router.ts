import * as express from 'express';
import { MSCore } from '../interfaces';

export interface MSRouterOptions extends express.RouterOptions {
  enable?: boolean;
  path?: string;
}

export abstract class MSRouter {
  public readonly router!: express.Router;

  constructor(public readonly options: MSRouterOptions = {}) {
    this.router = express.Router(options);
  }

  public assignRouter(app: express.Express) {
    if (this.options.enable === false) {
      return;
    }

    if (this.options.path) {
      app.use(this.options.path, this.router);
    } else {
      app.use(this.router);
    }
  }

  public abstract handle(
    config: any,
    ...handlers: Array<MSCore.RequestHandler<any, any, any, any, any>>
  ): this;
}
