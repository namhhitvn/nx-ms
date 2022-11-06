import { forceNumber, forceString } from '@nx-ms/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import pinoHttp, { Options as pinoHttpOptions } from 'express-pino-logger';
import { MSCore } from '../interfaces';

export interface AppBootstrapOptions {
  // app options
  appAutoListen?: boolean; // default: true
  appPort?: number; // default: process.env.APP_PORT || process.env.PORT || 3333
  appHost?: string; // default: process.env.APP_HOST || process.env.HOST || 0.0.0.0

  // middleware CORS
  useCORS?: boolean; // default: false
  corsOptions?: cors.CorsOptions;
  corsOptionsDelegate?: cors.CorsOptionsDelegate;

  // middleware parse JSON
  useParseJSON?: boolean; // default: true
  parseJsonOptions?: Parameters<typeof express.json>[0];

  // middleware parse url encode
  useParseUrlEncoded?: boolean; // default: true
  parseUrlEncodeOptions?: Parameters<typeof express.urlencoded>[0];

  // middleware parse cookie
  useParseCookie?: boolean; // default: false
  parseCookieSecret?: string | string[];
  parseCookieOptions?: cookieParser.CookieParseOptions;

  // middleware pino http logging
  usePinoHttp?: boolean; // default: true
  pinoHttpOptions?: pinoHttpOptions;

  // middleware app static
  useStaticDefault?: boolean; // default: true
  staticPath?: string | string[] | { [endpoint: string]: string | string[] };
  staticConfig?: Parameters<typeof express.static>[1];
}

/**
 * It's a wrapper for `express()` that sets up some default middleware and options
 */
export function appBootstrap(
  options: AppBootstrapOptions = {},
  callback?: (app: express.Express) => void
): express.Express {
  const app = express();

  // ref: https://github.com/expressjs/cors#configuration-options
  if (options.useCORS) {
    app.use(cors(options.corsOptions || options.corsOptionsDelegate));
  }

  // ref: https://expressjs.com/en/4x/api.html#express.json
  if (options.useParseJSON !== false) {
    app.use(
      express.json({
        verify: (
          req: MSCore.Request,
          _res: MSCore.Response,
          buf: Buffer,
          encoding: BufferEncoding
        ): void => {
          if (buf && buf.length) {
            (req as WithWritable<MSCore.Request>).rawBody = buf.toString(encoding || 'utf8');
          }
        },
      })
    );
  }

  // ref: https://expressjs.com/en/4x/api.html#express.urlencoded
  if (options.useParseUrlEncoded !== false) {
    app.use(express.urlencoded({ extended: false }));
  }

  // ref: https://github.com/expressjs/cookie-parser#api
  if (options.useParseCookie) {
    app.use(cookieParser(options.parseCookieSecret, options.parseCookieOptions));
  }

  // ref: https://github.com/pinojs/express-pino-logger
  if (options.usePinoHttp !== false) {
    app.use(pinoHttp(options.pinoHttpOptions));
  }

  // ref: https://expressjs.com/en/4x/api.html#express.static
  if (options.useStaticDefault !== false) {
    if (
      typeof options.staticPath === 'string' ||
      (Array.isArray(options.staticPath) && options.staticPath.length)
    ) {
      for (const staticPath of Array.isArray(options.staticPath)
        ? options.staticPath
        : [options.staticPath]) {
        app.use(express.static(staticPath, options.staticConfig));
      }
    } else if (options.staticPath !== undefined) {
      for (const [endpoint, paths] of Object.entries(options.staticPath)) {
        for (const staticPath of Array.isArray(paths) ? paths : [paths]) {
          app.use(endpoint, express.static(staticPath, options.staticConfig));
        }
      }
    }
  }

  if (options.appAutoListen !== false) {
    const appPort = forceNumber(
      options.appPort || process.env['APP_PORT'] || process.env['PORT'],
      3333
    );
    const appHost = forceString(
      options.appHost || process.env['APP_HOST'] || process.env['HOST'] || '0.0.0.0'
    );

    app.listen(appPort, appHost, function () {
      console.log(`App listening on ${appHost}:${appPort}`);
    });
  }

  callback?.(app);

  return app;
}

export default appBootstrap;
