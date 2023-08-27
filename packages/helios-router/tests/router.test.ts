import { expect, test } from '@playwright/test';

//
//

test('Deve ir de Home para About com sucesso', async ({ page }) => {
  //
  await page.goto('http://localhost:3039/');
  await page
    .getByText('App Root')
    .click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('About');
  await expect(page.getByRole('main')).toContainText('Clicks on app-link: 2');
});

//
//

test.skip('Deve ir de About para About with error com sucesso', async ({ page }) => {
  //
  await page.goto('http://localhost:3039/');

  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('LOADING...');
  await expect(page.getByRole('main')).toContainText('About');

  await page.getByRole('link', { name: 'About with error' }).click();
  await expect(page.getByRole('main')).toContainText('LOADING...');
  await expect(page.getByRole('main')).toContainText('SOME ERROR...');
});

//
//

test.skip('Deve ir para Cliente com sucesso', async ({ page }) => {
  //
  await page.goto('http://localhost:3039/');
  await page.getByRole('link', { name: 'Cliente 1' }).click();
  expect(page.url()).toBe('http://localhost:3039/client/1');

  await expect(page.getByRole('main')).toContainText('CLIENT LOADING...');
  await expect(page.getByRole('main')).toContainText('Meu id é 1 It worked');
  await expect(page.getByRole('main')).toContainText('I Cliente Child');
});

//
//

test.skip('popstate deve funcionar com sucesso', async ({ page }) => {
  //
await page.goto('http://localhost:3039/');

await page.getByRole('link', { name: 'Home' }).click();
await expect(page.getByRole('main')).toContainText('TODO CONTENT Você está na página / E os props são {}');

await page.getByRole('link', { name: 'About', exact: true }).click();
await expect(page.getByRole('main')).toContainText('About');

await page.getByRole('link', { name: 'About with error' }).click();
await expect(page.getByRole('main')).toContainText('SOME ERROR...');

await page.goBack();
await expect(page.getByRole('main')).toContainText('About');

await page.goBack();
await expect(page.getByRole('main')).toContainText('TODO CONTENT Você está na página / E os props são {}');
});
