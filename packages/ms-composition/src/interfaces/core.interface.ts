import { HttpRestRequestRepositoryMetadata } from '@nx-ms/common';
import type { NextFunction, Request as ExRequest, Response as ExResponse } from 'express';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MSCore {
  interface RequestMetadata {
    rest?: HttpRestRequestRepositoryMetadata<any>;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Request<
    Response = ObjectLiteral,
    Params = ObjectLiteral,
    Body = ObjectLiteral,
    Query = ObjectLiteral,
    Locals extends Record<string, any> = Record<string, any>,
    ReqMetadata extends RequestMetadata = RequestMetadata
  > extends ExRequest<Params, Response, Body, Query, Locals> {
    rawBody?: string;
    restMetadata: ReqMetadata extends RequestMetadata
      ? ReqMetadata['rest'] extends HttpRestRequestRepositoryMetadata<any>
        ? ReqMetadata['rest']
        : undefined
      : undefined;
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
    Locals extends Record<string, any> = Record<string, any>,
    ReqMetadata extends RequestMetadata = RequestMetadata
  > {
    (
      req: Request<ResBody, Params, Body, Query, Locals, ReqMetadata>,
      res: Response<ResBody, Locals>,
      next: NextFunction
    ): void;
  }

  export type RequestHandlerParameters<
    ResBody = ObjectLiteral,
    Params = ObjectLiteral,
    Body = ObjectLiteral,
    Query = ObjectLiteral,
    Locals extends Record<string, any> = Record<string, any>,
    ReqMetadata extends RequestMetadata = RequestMetadata
  > = Parameters<RequestHandler<ResBody, Params, Body, Query, Locals, ReqMetadata>>;
}
