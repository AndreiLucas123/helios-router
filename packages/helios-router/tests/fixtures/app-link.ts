import { customEl } from './customEl';
import { router } from './router';

customEl('app-link', (el) => {
  const anchor = el.querySelector('a')!;

  if (!anchor) {
    throw new Error('app-link needs a anchor as child');
  }

  function onClick(e: Event) {
    router.appStateStore.produce((appState) => {
      appState.appLinkClicks++;
    });
    e.preventDefault();
    router.push((e.target as HTMLAnchorElement).getAttribute('href')!);
  }

  anchor.addEventListener('click', onClick);
});
