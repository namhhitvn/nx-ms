import { forceNumber, forceString } from '@nx-ms/common';
import { AppBootstrapOptions } from './app-bootstrap';

let instance: AppEnvironment;

export class AppEnvironment {
  public static get instance() {
    if (!instance) instance = new AppEnvironment();
    return instance;
  }

  public readonly bootstrapOptions!: AppBootstrapOptions;

  public get isDevelopment() {
    return this.NODE_ENV === 'development';
  }

  public readonly NODE_ENV = process.env['NODE_ENV'];
  public readonly RES_ERROR_DETAIL = !(process.env['NODE_ENV'] === 'production');

  public readonly APP_PORT = forceNumber(process.env['APP_PORT'] || process.env['PORT'], 3333);
  public readonly APP_HOST = forceString(process.env['APP_HOST'] || process.env['HOST'], '0.0.0.0');
}
