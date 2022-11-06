// GENERATED CODE -- DO NOT EDIT!
import { join, resolve } from 'path';
import * as moduleAlias from 'module-alias';
import { loadConfig } from 'tsconfig-paths';

const nxProjectName = __dirname.split('/src')[0].split('/').pop();
const nxRootDir =
  process.env['NX_WORKSPACE_ROOT'] ||
  __dirname.split('/dist')[0] ||
  __dirname.split('/apps')[0] ||
  resolve(__dirname, '../../../') ||
  '/app';
const distDir = join(nxRootDir, 'dist', nxProjectName);
const loadResult = loadConfig(join(nxRootDir, 'apps', nxProjectName, 'tsconfig.app.json'));

if (loadResult?.resultType === 'success' && Object.keys(loadResult.paths)) {
  moduleAlias.addAliases(
    Object.entries(loadResult.paths).reduce((cur, [path, resolve]) => {
      let pathToResolve = Array.isArray(resolve) ? resolve[0] : resolve;
      pathToResolve =
        typeof pathToResolve === 'string' && pathToResolve.trim()
          ? join(distDir, pathToResolve.split('/*')[0]).split('/index')[0]
          : '';

      if (pathToResolve) {
        cur[path.split('/*')[0]] = pathToResolve;
      }

      return cur;
    }, {})
  );
}
