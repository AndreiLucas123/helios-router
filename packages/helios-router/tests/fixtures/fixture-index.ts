import { html, render } from 'lit-html';
import { customEl } from './customEl';
import { router } from './router';
import { appStateStore } from './appStateStore';
import './appFrameLitHTML';
import './app-link';

//
//

customEl('app-root', (el) => {
  window.addEventListener('popstate', router.popState);
  let notLoader = true;
  let lastErr = null;

  //
  //

  const unsub = appStateStore.subscribe(() => {
    if (notLoader) {
      return;
    }
    render(rerender(), el);
  });

  //
  //

  function displayAppState() {
    const appState = appStateStore.get();
    console.log('appState', appState);
  }

  //
  //

  function rerender(err?: any) {
    if (err) {
      console.error(err);
      return html`<main>
        <h3>App Root</h3>
        <div>Clicks on app-link: ${appStateStore.get().appLinkClicks}</div>
        <div>Error ${err.toString()}</div>
        <app-frame-lit-html id="root"></app-frame-lit-html>
      </main>`;
    }

    return html`<main>
      <h3>App Root</h3>
      <div>Clicks on app-link: ${appStateStore.get().appLinkClicks}</div>
      <app-frame-lit-html id="root"></app-frame-lit-html>
      <div @click=${displayAppState}>Display appState</div>
    </main>`;
  }

  //
  //

  router
    .load(new URL(window.location.href)) //
    .catch((err) => {
      console.error(err);
      lastErr = err;
    })
    .finally(() => {
      notLoader = false;
      render(rerender(lastErr), el);
    });

  //
  //

  return unsub;
});
