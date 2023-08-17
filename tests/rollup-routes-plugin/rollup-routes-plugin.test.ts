import { expect, test } from '@playwright/test';
import { routesWatcher } from '../../dist/rollup-routes-plugin';

//
//

test.only('Deve criar o arquivo routes.ts com sucesso sucesso', async ({ page }) => {
  //
  const watcher = routesWatcher({
    pagesGlob: './fixtures/rollup-routes-plugin/**/*.page.ts',
    outputFile: './fixtures/rollup-routes-plugin/routes.ts',
  });
  watcher.start();

  // Wait 100ms to generate routes.ts
  await page.waitForTimeout(100);
  watcher.stop();
});
