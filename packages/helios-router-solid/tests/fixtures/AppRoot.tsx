import { Show, createSignal, onCleanup } from 'solid-js';
import { appStateStore } from './appStateStore';
import { router } from './router';
import { RoutePlaceholder } from './RoutePlaceholder';
import { useSolidSubscribe } from '../../dist';

//
//

export function AppRoot() {
  const [err, setErr] = createSignal<any>(null);
  const appState = useSolidSubscribe(appStateStore);

  //
  //

  window.addEventListener('popstate', router.popState);
  onCleanup(() => {
    window.removeEventListener('popstate', router.popState);
  });

  //
  //

  function displayAppState() {
    const appState = appStateStore.get();
    console.log('appState', appState);
  }

  //
  //

  router
    .load(new URL(window.location.href)) //
    .then(() => {
      console.log('router.load done');
      setErr(null);
    })
    .catch((err: any) => {
      console.error(err);
      setErr(err);
    });

  //
  //

  return (
    <main>
      <h3>App Root</h3>
      <div>Clicks on app-link: {appState().appLinkClicks}</div>
      <div>Url props {JSON.stringify(appState().router.urlProps)}</div>
      <Show when={err()}>
        <div>Error {err().toString()}</div>
      </Show>
      <RoutePlaceholder id='root' />
      <div onclick={displayAppState}>Display appState</div>
    </main>
  );
}
