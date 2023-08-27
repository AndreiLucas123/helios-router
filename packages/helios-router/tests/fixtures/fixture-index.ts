import { html, render } from 'lit-html';
import { customEl } from './customEl';
import { router } from './router';
import './appFrameLitHTML';
import './app-link';

//
//

customEl('app-root', (el) => {
  window.addEventListener('popstate', router.popState);

  router
    .load(new URL(window.location.href))
    .then(() => {
      render(
        html`<div>
          <h3>Initial load complete</h3>
          <app-frame-lit-html id="root"></app-frame-lit-html>
        </div>`,
        el,
      );
    })
    .catch((err) => {
      console.error(err);
      render(html`<div>Error ${err.toString()}</div>`, el);
    });
});
