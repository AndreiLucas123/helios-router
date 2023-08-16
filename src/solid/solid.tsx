import { Dynamic } from 'solid-js/web';
import { routeAppFrameConfig } from '../router';
import { createSignal, onCleanup } from 'solid-js';

//
//

export type AppFrameSolidProps = {
  id: string;
};

//
//

export function AppFrameSolid(props: AppFrameSolidProps) {
  const [value, setValue] = createSignal<any>(null);

  const unsubscribe = routeAppFrameConfig.subscribe((c) => {
    setValue(() => c?.[props.id] || null);
  });

  onCleanup(unsubscribe);

  return <Dynamic component={value()} />;
}
