import { expect, test } from '@playwright/test';

//
//

test('Deve ir de Home para About com sucesso', async ({ page }) => {
  //
  await page.goto('http://localhost:3040/');
  await page.getByText('App Root').click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('About');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 2');
});

//
//

test('Deve ter Url props como {} quando não está em nenhuma rota com urlProps', async ({
  page,
}) => {
  //
  await page.goto('http://localhost:3040/');
  await page.getByText('App Root').click();
  await expect(page.getByRole('main')).toContainText('Url props {}');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 0');
});

//
//

test('Deve ter Url props como {"id":"1"} quando define urlProps com queryParams', async ({
  page,
}) => {
  //
  await page.goto('http://localhost:3040/?id=1');
  await page.getByText('App Root').click();
  await expect(page.getByRole('main')).toContainText('Url props {"id":"1"}');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 0');
});

//
//

test('Deve ter Url props como {"id":"1"} quando vai em uma rota com params como :id por exemplo', async ({
  page,
}) => {
  //
  await page.goto('http://localhost:3040/client/1');
  await expect(page.getByRole('main')).toContainText('Client id: 1');
  await expect(page.getByRole('main')).toContainText('Url props {"id":"1"}');
  await page.goto('http://localhost:3040/client/2');
  await expect(page.getByRole('main')).toContainText('Client id: 2');
  await expect(page.getByRole('main')).toContainText('Url props {"id":"2"}');
  await page.goto('http://localhost:3040/client/3');
  await expect(page.getByRole('main')).toContainText('Client id: 3');
  await expect(page.getByRole('main')).toContainText('Url props {"id":"3"}');
  await page.goto('http://localhost:3040/client/4');
  await expect(page.getByRole('main')).toContainText('Client id: 4');
  await expect(page.getByRole('main')).toContainText('Url props {"id":"4"}');
});

//
//

test('Deve ter Url props como {"id":"1"} quando navegar', async ({ page }) => {
  //
  await page.goto('http://localhost:3040/client/1');
  await expect(page.getByRole('main')).toContainText('Client id: 1');
  await expect(page.getByRole('main')).toContainText('Url props {"id":"1"}');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 0');

  await page.getByRole('link', { name: 'Home' }).click();
  expect(page.url()).toBe('http://localhost:3040/');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 1');

  await page.getByRole('link', { name: 'Client 2' }).click();
  expect(page.url()).toBe('http://localhost:3040/client/2');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 2');
  await expect(page.getByRole('main')).toContainText('Client id: 2');
  await expect(page.getByRole('main')).toContainText('Url props {"id":"2"}');

  await page.getByRole('link', { name: 'Client 3' }).click();
  expect(page.url()).toBe('http://localhost:3040/client/3?search=randomstuff');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 3');
  await expect(page.getByRole('main')).toContainText('Client id: 3');
  await expect(page.getByRole('main')).toContainText(
    'Url props {"search":"randomstuff","id":"3"}',
  );
});

//
//

test('popstate deve funcionar com sucesso', async ({ page }) => {
  //
  await page.goto('http://localhost:3040');

  await expect(page.getByRole('main')).toContainText('App Root');
  await expect(page.getByRole('main')).toContainText('Home');
  await expect(page.getByRole('main')).toContainText('Url props {}');

  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('About');

  await page.goBack();
  await expect(page.getByRole('main')).toContainText('Home');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 1');

  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('About');

  await page.getByRole('link', { name: 'Client 1', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('Client 1');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 3');

  await page.goBack();
  await page.goBack();
  await expect(page.getByRole('main')).toContainText('Home');
});
