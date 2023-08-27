import { expect, test } from '@playwright/test';
import { routesWatcher } from '../dist/index';
import fs from 'fs';
import exp from 'constants';

//
//

test('Deve criar o arquivo routes.ts com sucesso sucesso', async ({ page }) => {
  //
  const watcher = routesWatcher({
    routesFolder: './fixtures/app',
  });
  watcher.start();

  // Wait 100ms to generate routes.ts
  await page.waitForTimeout(100);
  watcher.stop();

  // Check if routes.ts exists
  const routes = fs.existsSync('./fixtures/app/routes.ts');
  expect(routes).toBeTruthy();

  // Snapshot of routes content
  const routesContent = fs.readFileSync('./fixtures/app/routes.ts', 'utf-8');
  expect(routesContent).toMatchSnapshot();
});
