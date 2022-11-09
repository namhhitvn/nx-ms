import { MSCore } from '../interfaces';
import * as express from 'express';

export abstract class MSInterceptor {
  public abstract handle: MSCore.RequestHandler;

  public apply(app: express.Express): void {
    app.use(this.handle as express.RequestHandler);
  }
}
