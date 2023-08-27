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

  if (accessors.length < 2) {
    createEffect(() => {
      accessors.forEach((accessor) => accessor());

      untrack(callback);
    });
  } else {
    let isDirty = false;

    //
    //

    createEffect(() => {
      accessors.forEach((accessor) => accessor());

      if (isDirty) {
        return;
      }

      isDirty = true;

      Promise.resolve().then(() => {
        isDirty = false;
        callback();
      });
    });
  }
}
