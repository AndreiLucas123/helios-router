import { html } from "lit-html";

export function navComponent() {
  return html`<nav>
    <app-link href="/">
      <a href="/">Home</a>
    </app-link>

    <app-link href="/">
      <a href="/about">About</a>
    </app-link>
  </nav>`;
}
