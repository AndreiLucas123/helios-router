import { html } from 'lit-html';
import { navComponent } from './nav-component';

export default {
  root: () => {
    return html`
      <div>Not Found</div>
      <app-frame-lit-html id="link"></app-frame-lit-html>
    `;
  },
  //
  link: navComponent,
};
