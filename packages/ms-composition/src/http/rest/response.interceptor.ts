import { MSRestRequestHandle, MSRouterRest } from './router-rest';
import { MSInterceptor } from '../interceptor';
import { MSCore } from '../../interfaces';
import * as express from 'express';
import { AppEnvironment } from '../../core/app-environment';
import { HttpRestResponse } from '@nx-ms/common';
import {
  FatalErrorException,
  InternalServerErrorException,
  RuntimeErrorException,
} from '../../exception';
import { HttpStatus } from '@nx-ms/common/src/http/constant';

export class MSRestResponseInterceptor extends MSInterceptor {
  public handle: MSRestRequestHandle<any, any> = (_req, res, next) => {
    this.overrideSendFunction(res, 'json');
    this.overrideSendFunction(res, 'jsonp');

    next();
  };

  public override apply(app: express.Express): void {
    if (
      AppEnvironment.instance.bootstrapOptions?.useRouters?.some(
        (msRouter) => msRouter instanceof MSRouterRest
      )
    ) {
      app.use(this.handle as express.RequestHandler);

      app.once('bootstrap:listening', () => {
        (app.use as any)(
          (
            error: Error | HttpRestResponse<any>,
            req: MSCore.Request<any, any, any, any, any, any>,
            res: MSCore.Response<any, any>,
            next: express.NextFunction
          ) => {
            if (!req.restMetadata) {
              return next();
            }

            if (error instanceof HttpRestResponse) {
              return res.status(error.statusCode!).end();
            }

            if (!(error instanceof RuntimeErrorException)) {
              error = new InternalServerErrorException('Something went wrong', error.stack);
            }

            const debugError = error as RuntimeErrorException;
            const response = new HttpRestResponse(
              undefined,
              debugError.statusCode,
              debugError.message
            );

            if (AppEnvironment.instance.RES_ERROR_DETAIL) {
              (response as any).__error__ = {
                ...debugError,
                stack: debugError.stack || undefined,
              };
            }

            res.status(debugError.statusCode);
            res.json(response).end();
          }
        );
      });
    }
  }

  private overrideSendFunction<Res extends MSCore.Response<any, any>>(
    res: Res,
    methodKey: keyof Res
  ) {
    const original = res[methodKey] as express.Send;
    (res as any)[methodKey] = function (resBody?: any) {
      if (!(resBody instanceof HttpRestResponse)) {
        throw new FatalErrorException('Response is invalid');
      }
      res.status((resBody as any)['statusCode'] || HttpStatus.OK);
      return original.call(this, resBody);
    };
  }
}
