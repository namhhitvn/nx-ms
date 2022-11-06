import type {
  NextFunction,
  Request as ExRequest,
  RequestHandler as ExRequestHandler,
  Response as ExResponse,
} from 'express';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MSCore {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Request<
    Response = ObjectLiteral,
    Params = ObjectLiteral,
    Body = ObjectLiteral,
    Query = ObjectLiteral,
    Locals extends Record<string, any> = Record<string, any>
  > extends ExRequest<Params, Response, Body, Query, Locals> {
    readonly rawBody?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Response<
    ResBody = ObjectLiteral,
    Locals extends Record<string, any> = Record<string, any>
  > extends ExResponse<ResBody, Locals> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface RequestHandler<
    ResBody = ObjectLiteral,
    Params = ObjectLiteral,
    Body = ObjectLiteral,
    Query = ObjectLiteral,
    Locals extends Record<string, any> = Record<string, any>
  > extends ExRequestHandler<Params, ResBody, Body, Query, Locals> {
    (
      req: Request<Params, ResBody, Body, Query, Locals>,
      res: Response<ResBody, Locals>,
      next: NextFunction
    ): void;
  }
}
