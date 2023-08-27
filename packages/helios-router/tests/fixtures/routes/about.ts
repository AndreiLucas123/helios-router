import { html } from 'lit-html';

export default {
  root: () => {
    return html`
      <div>About</div>
      <app-frame-lit-html id="link"></app-frame-lit-html>
    `;
  },
  //
  link: () => {
    return html`<nav>
      <app-link href="/">
        <a href="/">Home</a>
      </app-link>

      <app-link href="/">
        <a href="/about">About</a>
      </app-link>
    </nav>`;
  },
};
