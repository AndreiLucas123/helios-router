import { Page, expect, test } from '@playwright/test';

function expectMainText(page: Page, text: string) {
  return expect(page.getByRole('main')).toContainText(text);
}

function clickButton(page: Page, name: string) {
  return page.getByRole('button', { name }).click();
}

//
//

test('Deve atualizar com um único elemento', async ({ page }) => {
  //
  await page.goto('http://localhost:3040/create-on-effect-test');
  await expectMainText(page, 'CreateOnEffectTest');
  await expectMainText(page, 'Click to update single value, 0');
  await expectMainText(page, 'Click to update two values, 0 and 0');
  await expectMainText(page, 'Effects count: 1');

  //
  //

  await clickButton(page, 'Click to update single value');
  await expectMainText(page, 'Click to update single value, 1');
  await expectMainText(page, 'Click to update two values, 1 and 0');
  await expectMainText(page, 'Effects count: 2');

  //
  //

  await clickButton(page, 'Click to update two values');
  await expectMainText(page, 'Click to update single value, 2');
  await expectMainText(page, 'Click to update two values, 2 and 1');
  await expectMainText(page, 'Effects count: 3');
});
