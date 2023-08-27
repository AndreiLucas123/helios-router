import { html } from 'lit-html';
import { navComponent } from './nav-component';
import { ReactiveComponent } from '../ReactiveComponent';

export default {
  root: () => {
    const reactive = new ReactiveComponent((appState) => {
      return html`<div>Client id: ${appState.router.urlProps?.id}</div>`;
    });

    return html`
      ${reactive}
      <app-frame-lit-html id="link"></app-frame-lit-html>
    `;
  },
  //
  link: navComponent,
};
