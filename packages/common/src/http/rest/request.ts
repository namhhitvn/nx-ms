import { HttpRequestMethod } from '../../constants/http.constant';
import { HttpRestResponse } from './response';

export abstract class HttpRestRequest<
  Response extends HttpRestResponse<any>,
  Params extends unknown | Constructor = unknown,
  Body extends unknown | Constructor = unknown,
  Query extends unknown | Constructor = unknown,
  File extends unknown | Constructor = unknown,
> {
  // request payload/response classes
  public readonly Response!: Response;
  public readonly Params!: Params;
  public readonly Query!: Query;
  public readonly Body!: Body;
  public readonly File!: File;

  public abstract readonly path: string;
  public abstract readonly method: HttpRequestMethod;
  public readonly params!: Params extends Constructor ? InstanceType<Params> : undefined;
  public readonly query!: Query extends Constructor ? InstanceType<Query> : undefined;
  public readonly body!: Body extends Constructor ? InstanceType<Body> : undefined;
  public readonly file!: File extends Constructor ? InstanceType<File> : undefined;

  public get interpolatedPath(): string {
    let path = this.path;

    if (this.params && Object.keys(this.params).length) {
      Object.keys(this.params).forEach((key) => {
        path = path.replace(':' + key, String((this.params as any)[key]));
      });
    }

    if (this.query && Object.keys(this.query).length) {
      const query = Object.entries(this.query).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value;
        return acc;
      }, {} as any);
      const queryString = new URLSearchParams(query as any).toString();

      if (queryString.length) {
        path += `?${new URLSearchParams(query as any).toString()}`;
      }
    }

    return path;
  }
}
