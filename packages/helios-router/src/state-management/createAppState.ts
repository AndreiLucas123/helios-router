import type { IReadable } from './state-management-types';
import { produce } from 'immer';

//
//

/**
 * AppState are state more related to the server, but can be used for any state.
 */
export interface AppStateStore<T> extends IReadable<T> {
  initial: T;

  /**
   * Uses immer produce function
   *
   * The `produce` function takes a value and a "recipe function" (whose
   * return value often depends on the base state). The recipe function is
   * free to mutate its first argument however it wants. All mutations are
   * only ever applied to a __copy__ of the base state.
   *
   * Pass only a function to create a "curried producer" which relieves you
   * from passing the recipe function every time.
   *
   * Only plain objects and arrays are made mutable. All other objects are
   * considered uncopyable.
   * @param producer The recipe function to create a new value
   * @param noEmit If true, the subscribers will not be called yet, normally will the emit will be called after
   */
  produce(producer: (draft: T) => void, noEmit?: boolean): T;

  /**
   * Emit the new value to the subscribers, usually is used after the `produce` function with noEmit = true
   */
  emit(): void;

  /**
   * dev properties to the Selector. For debug purposes.
   */
  dev?: {
    value: T;
    subscribers: Set<(value: T) => void>;
  };
}

/**
 * Factory function to create a new appState `(IWritable)`.
 * @param initial The initial value of the appState
 */
export function createAppState<T>(initial: T): AppStateStore<T> {
  let value = initial;
  const subscribers = new Set<(value: T) => void>();

  //
  //

  function emit() {
    subscribers.forEach((callback) => callback(value));
  }

  //
  //

  const _appState: AppStateStore<T> = {
    get() {
      return value;
    },

    subscribe(callback: (value: T) => void) {
      callback(value);
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
      };
    },

    produce(producer, noEmit = false): T {
      const newValue = produce(value, producer);

      if (noEmit) {
        return (value = newValue);
      }

      if (newValue === value) return value;

      value = newValue;
      emit();

      return value;
    },

    emit,

    initial: __DEV__ ? Object.freeze(initial) : initial,
  };

  //
  //

  if (__DEV__) {
    _appState.dev = {
      get value() {
        return value;
      },
      subscribers,
    };
  }

  //
  //

  return _appState;
}
