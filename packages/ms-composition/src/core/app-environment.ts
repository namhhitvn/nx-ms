import { AppBootstrapOptions } from './app-bootstrap';

let instance: AppEnvironment;

export class AppEnvironment {
  public static get instance() {
    if (!instance) instance = new AppEnvironment();
    return instance;
  }

  public readonly bootstrapOptions!: AppBootstrapOptions;

  public readonly RES_ERROR_DETAIL = !(process.env['NODE_ENV'] === 'production');
}
