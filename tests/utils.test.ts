import { expect, test } from '@playwright/test';
import { html } from './utils/utils';

//
//

test('html utility deve retornar o valor esperado', () => {
  const valor1 = 'Olá';
  const valor2 = 'Mundo';
  const exemplo = html`<div>${valor1}</div>
    <p>${valor2}</p>`;

  expect(exemplo).toBe('<div>Olá</div>\n    <p>Mundo</p>');
});
