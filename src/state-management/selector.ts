import type { IReadable } from './state-management-types';

//
//

export interface Selector<U, T> extends IReadable<U> {
  /**
   * dev properties to the Selector. For debug purposes.
   */
  dev?: {
    value: U;
    fromValue: T;
    subscribers: Set<(value: U) => void>;
    started: boolean;
  };
}

//
//

export function selector<U, T>(
  from: IReadable<T>,
  getter: (value: T) => U,
): Selector<U, T> {
  let value: U;
  let fromValue: T;
  let unsub: (() => void) | undefined;
  const subscribers = new Set<(value: U) => void>();

  //
  //

  function set(newValue: T) {
    if (fromValue === newValue) return;
    fromValue = newValue;
    value = getter(newValue);
    subscribers.forEach((callback) => callback(value));
  }

  //
  //

  const _selector: Selector<U, T> = {
    get() {
      if (!unsub) {
        return getter(from.get());
      }
      return value;
    },

    subscribe(callback: (value: U) => void): () => void {
      if (!unsub) {
        unsub = from.subscribe((v) => set(v));
      }

      callback(value);
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          unsub?.();
          unsub = undefined;
        }
      };
    },
  };

  //
  //

  if (__DEV__) {
    _selector.dev = {
      get value() {
        return value;
      },
      get fromValue() {
        return fromValue;
      },
      get started() {
        return unsub !== undefined;
      },
      subscribers,
    };
  }

  //
  //

  return _selector;
}
