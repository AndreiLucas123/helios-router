import { SvelteComponent } from 'svelte';

// Declare a nova propriedade no objeto global 'window'
declare const __DEV__: boolean;

declare module '*.svelte' {
  export default SvelteComponent;
}
