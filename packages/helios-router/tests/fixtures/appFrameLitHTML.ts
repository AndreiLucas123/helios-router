import { render } from 'lit-html';
import { customEl } from './customEl';
import { router } from './router';

//
//

customEl('app-frame-lit-html', (el) => {
  if (!el.id) {
    throw new Error('app-frame-lit-html must have an id');
  }

  const id = el.id;

  const unsub = router.appStateStore.subscribe((state) => {
    if (!state.routeExport) {
      throw new Error('for app-frame-lit-html the routeExport must be defined');
    }

    const renderAppFrame = state.routeExport[id];

    if (!renderAppFrame) {
      throw new Error(
        `for app-frame-lit-html the routeExport must have a key of ${id}`,
      );
    }

    const template = renderAppFrame();

    if (!(typeof template === 'object' && '_$litType$' in template)) {
      throw new Error(
        `for app-frame-lit-html the routeExport[id] function must return an lit-html template literal`,
      );
    }

    render(template, el);
  });

  return unsub;
});
