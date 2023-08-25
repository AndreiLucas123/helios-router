import type { IWritable } from './state-management-types';
//
//

export interface Atom<T> extends IWritable<T> {
  /**
   * dev properties to the Selector. For debug purposes.
   */
  dev?: {
    value: T;
    subscribers: Set<(value: T) => void>;
  };
}

/**
 * Factory function to create a new atom `(IWritable)`.
 * @param initial The initial value of the atom.
 * @param name The name of the atom. For debug purposes.
 */
export function atom<T>(initial: T): Atom<T> {
  let value = initial;
  const subscribers = new Set<(value: T) => void>();

  //
  //

  const _atom: Atom<T> = {
    get() {
      return value;
    },

    set(newValue: T) {
      if (value === newValue) return;
      value = newValue;
      subscribers.forEach((callback) => callback(value));
    },

    subscribe(callback: (value: T) => void) {
      callback(value);
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
      };
    },
  };

  //
  //

  if (__DEV__) {
    _atom.dev = {
      get value() {
        return value;
      },
      subscribers,
    };
  }

  //
  //

  return _atom;
}
