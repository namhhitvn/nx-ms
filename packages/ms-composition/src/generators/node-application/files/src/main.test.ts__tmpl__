import { AppEnvironment } from '@nx-ms/ms-composition/src/core/app-environment';

import app from './main';

describe('Test application', function () {
  test('Should app environment setting equal AppEnvironment', async () => {
    expect(app.get('environment')).toEqual(AppEnvironment.instance);
  });

  test('Should app environments not exist', async () => {
    expect(app.get('environments')).toEqual(undefined);
  });
});
