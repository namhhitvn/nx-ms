import { HttpRequestMethod } from '../../constants/http.constant';
import { HttpRestRequestRepository } from './request-repository.decorator';

type IHttpRestRequestArguments<Params, Body, Query> = Query extends Constructor
  ? Body extends Constructor
    ? Params extends Constructor
      ? { 0: InstanceType<Params>; 1: InstanceType<Body>; 2: InstanceType<Query> } & [
          InstanceType<Params>,
          InstanceType<Body>,
          InstanceType<Query>
        ]
      : { 0: InstanceType<Body>; 1: InstanceType<Query> } & [
          InstanceType<Body>,
          InstanceType<Query>
        ]
    : Params extends Constructor
    ? { 0: InstanceType<Params>; 1: InstanceType<Query> } & [
        InstanceType<Params>,
        InstanceType<Query>
      ]
    : { 0: InstanceType<Query> } & [InstanceType<Query>]
  : Body extends Constructor
  ? Params extends Constructor
    ? { 0: InstanceType<Params>; 1: InstanceType<Body> } & [
        InstanceType<Params>,
        InstanceType<Body>
      ]
    : { 0: InstanceType<Body> } & [InstanceType<Body>]
  : [];

export type IHttpRestRequestWithArgs<
  Response extends Constructor,
  Params extends undefined | Constructor = undefined,
  Body extends undefined | Constructor = undefined,
  Query extends undefined | Constructor = undefined,
  File extends undefined | Constructor = undefined
> = [IHttpRestRequestArguments<Params, Body, Query>] extends [[]]
  ? { new (): HttpRestRequest<Response, Params, Body, Query, File> }
  : {
      new (...args: IHttpRestRequestArguments<Params, Body, Query>): HttpRestRequest<
        Response,
        Params,
        Body,
        Query,
        File
      >;
    };

export class HttpRestRequest<
  Response extends Constructor,
  Params extends undefined | Constructor = undefined,
  Body extends undefined | Constructor = undefined,
  Query extends undefined | Constructor = undefined,
  File extends undefined | Constructor = undefined
> {
  // request payload/response classes
  public readonly Response!: Response;
  public readonly Params!: Params;
  public readonly Query!: Query;
  public readonly Body!: Body;
  public readonly File!: File;

  public readonly path!: string;
  public readonly method: HttpRequestMethod = HttpRequestMethod.GET;
  public readonly params!: Params extends Constructor ? InstanceType<Params> : undefined;
  public readonly query!: Query extends Constructor ? InstanceType<Query> : undefined;
  public readonly body!: Body extends Constructor ? InstanceType<Body> : undefined;
  public readonly file!: File extends Constructor ? InstanceType<File> : undefined;

  constructor(...args: IHttpRestRequestArguments<Params, Body, Query>) {
    const self = this as any;
    const { Params, Query, Body, method, path } = HttpRestRequestRepository.get(self)!;

    if (method || path) {
      self.path = path;
      self.method = method;
    }

    if (Params === undefined) {
      if (Query === undefined) {
        if (Body) self.body = (args as any)[0];
      } else {
        self.query = (args as any)[0];
        if (Body) self.body = (args as any)[1];
      }
    } else {
      self.params = (args as any)[0];

      if (Query === undefined) {
        if (Body) self.body = (args as any)[1];
      } else {
        self.query = (args as any)[1];
        if (Body) self.body = (args as any)[2];
      }
    }
  }

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
