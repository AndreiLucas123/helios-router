export function customEl(
  tag: string,
  componentFn: (el: HTMLElement) => (() => void) | void,
) {
  class CustomEl extends HTMLElement {
    unmount?: () => void;

    connectedCallback() {
      componentFn(this);
    }

    disconnectedCallback() {
      this.unmount?.();
    }
  }

  customElements.define(tag, CustomEl);
}
