import { render } from 'lit-html';
import { AppStateStore, appStateStore } from './appStateStore';

export class ReactiveComponent extends HTMLElement {
  unsub!: () => void;

  constructor(readonly render: (appState: AppStateStore) => any) {
    super();
  }

  connectedCallback() {
    this.unsub = appStateStore.subscribe((state) => {
      render(this.render(state), this);
    });
  }

  disconnectedCallback() {
    this.unsub?.();
  }
}

customElements.define('reactive-component', ReactiveComponent);
