import { test } from '@playwright/test';
import { routesWatcher } from '../dist/index';

//
//

test.only('Deve criar o arquivo routes.ts com sucesso sucesso', async ({
  page,
}) => {
  //
  const watcher = routesWatcher({
    routesFolder: '../fixtures/app',
  });
  watcher.start();

  // Wait 100ms to generate routes.ts
  await page.waitForTimeout(100);
  watcher.stop();
});
