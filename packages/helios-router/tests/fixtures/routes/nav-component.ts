import { html } from 'lit-html';

export function navComponent() {
  return html`<nav>
    <app-link>
      <a href="/">Home</a>
    </app-link>

    <app-link>
      <a href="/about">About</a>
    </app-link>

    <app-link>
      <a href="/client/1">Client 1</a>
    </app-link>

    <app-link>
      <a href="/client/2">Client 2</a>
    </app-link>

    <app-link>
      <a href="/client/3?search=randomstuff">Client 3</a>
    </app-link>
  </nav>`;
}
