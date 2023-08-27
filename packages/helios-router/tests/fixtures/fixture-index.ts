import { html, render } from 'lit-html';
import { customEl } from './customEl';
import { router } from './router';

//
//

customEl('app-root', (el) => {
  render(html`<div>Hello World</div>`, el);

  window.addEventListener('popstate', router.popState);

  router.load(new URL(window.location.href));
});
