import { Accessor, createEffect, untrack } from 'solid-js';

//
//

export function createOnEffect(
  accessors: Accessor<any>[],
  callback: () => void,
) {
  // When SSR, we don't want to run the callback
  if (__SERVER__) {
    return;
  }

  accessors.forEach((accessor) => accessor());

  createEffect(() => untrack(callback));
}
