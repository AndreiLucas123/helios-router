import { IReadable } from 'helios-router';
import { type Accessor, createSignal, onCleanup } from 'solid-js';

//
//

export function useSolidSubscribe<T>(subscribable: IReadable<T>): Accessor<T> {
  if (__SERVER__) {
    return () => subscribable.get();
  }

  const [state, setSelectedStyle] = createSignal<T>(null as any);

  const unsub = subscribable.subscribe((value) =>
    setSelectedStyle(value as any),
  );

  onCleanup(unsub);

  return state;
}
