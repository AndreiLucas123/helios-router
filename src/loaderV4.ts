//
//

/** Readable interface for subscribing. */
export type IReadable<T> = {
  /**
   * Subscribe on value changes.
   */
  subscribe(run: (value: T) => void): () => void;
};

//
//

export const LOADING = Object.freeze({
  type: 'loading',
});

export const INITIAL = Object.freeze({
  type: 'initial',
});

//
//

export type LoaderStages<T> =
  | {
      type: 'loading';
    }
  | {
      type: 'initial';
    }
  | {
      type: 'error';
      from: IReadable<any>;
      error: unknown;
    }
  | {
      type: 'success';
      data: T;
    };

//
//

/** One or more values from `Readable` stores. */
export type StoresValues<T> = T extends IReadable<infer U>
  ? U
  : { [K in keyof T]: T[K] extends IReadable<infer U> ? U : never };

//
//

export interface LoaderV4<T> extends IReadable<LoaderStages<T>> {
  // Non Started Subscribers
  nsSubscribe: (run: (value: LoaderStages<T>) => void) => () => void;
  get(): LoaderStages<T>;

  // For test porposes, will be removed in production
  dev: null | {
    subscribers: Set<(value: LoaderStages<T>) => void>;
    nsSubscribers: Set<(value: LoaderStages<T>) => void>;
    values: any[];
    started: boolean;
    unsubscribers: (() => void)[] | null;
  };
}

//
//

export function loaderV4<U, T extends IReadable<any>[]>(
  dependencies: T,
  loaderFn: (values: StoresValues<T>) => U | Promise<U>,
): LoaderV4<U> {
  //
  //

  if (
    __DEV__ &&
    !dependencies.every((d) => d && typeof d.subscribe === 'function')
  ) {
    console.warn('loader dependencies', dependencies);
    throw new Error(
      'loaderV4() expects stores as input, got a store without subscribe',
    );
  }

  const subscribers = new Set<(value: LoaderStages<any>) => void>();
  // Non Started Subscribers
  const nsSubscribers = new Set<(value: LoaderStages<any>) => void>();

  //
  //

  let state: LoaderStages<any> = INITIAL;
  let unsubscribers: (() => void)[] | null = null;
  let started = false;
  let values = Array(dependencies.length);
  let pending = false;
  let processID = 0;

  //
  //

  function internSubscription(value: any, storeIndex: number) {
    //
    if (__DEV__) {
      if (typeof value !== 'object' || value === null) {
        console.warn(
          'loader dependencies does not returned an object',
          dependencies[storeIndex],
        );
        throw new Error(
          'Internal error, [internSubscription] is supposed to receive an object',
        );
      }
    }

    values[storeIndex] = value;

    if (!started) {
      return;
    }

    if (pending) {
      return;
    }

    pending = true;
    Promise.resolve().then(() => {
      pending = false;
      processID++;
      changedState();
    });
  }

  //
  //

  function setState(newState: LoaderStages<any>) {
    if (state === newState) return;
    state = newState;
    // Emit
    subscribers.forEach((sub) => sub(state));
    nsSubscribers.forEach((sub) => sub(state));
  }

  //
  //

  function start() {
    if (__DEV__ && unsubscribers !== null) {
      throw new Error(
        'Internal error, [start] is not supposed to be called twice with unsubscribers !== null',
      );
    }

    unsubscribers = dependencies.map((store, i) => {
      return store.subscribe((value) => internSubscription(value, i));
    });

    started = true;
    changedState();
  }

  //
  //

  function changedState(): void {
    const withError = values.findIndex((v) => v.type === 'error');

    if (withError !== -1) {
      return setState({
        type: 'error',
        from: dependencies[withError],
        error: values[withError],
      });
    }

    const withLoading = values.find((v) => v.type === 'loading');

    // Is already LOADING, so avoid re-assign
    if (withLoading) return setState(LOADING);

    let data: any;
    let currentProcessID = processID;
    try {
      data = loaderFn(values as StoresValues<T>) as any;
    } catch (error) {
      return setState({
        type: 'error',
        from: null as any,
        error,
      });
    }

    // Will keep loading until the data is resolved
    if (data && typeof data.then === 'function') {
      data
        .then((resolvedData: any) => {
          if (processID !== currentProcessID) return; // It was canceled
          setState({
            type: 'success',
            data: resolvedData,
          });
        })
        .catch((error: any) => {
          if (processID !== currentProcessID) return; // It was canceled
          setState({
            type: 'error',
            from: null as any,
            error,
          });
        });

      return setState(LOADING);
    }

    return setState({
      type: 'success',
      data,
    });
  }

  //
  //

  function stop() {
    if (unsubscribers === null) {
      return;
    }

    unsubscribers!.forEach((unsub) => unsub());

    unsubscribers = null;
    started = false;
  }

  //
  //

  return {
    subscribe(run: (value: LoaderStages<any>) => void): () => void {
      if (!started) {
        start();
      }

      run(state);

      //

      subscribers.add(run);
      return () => {
        subscribers.delete(run);
        if (subscribers.size === 0) {
          stop();
        }
      };
    },

    //
    //

    nsSubscribe(run) {
      nsSubscribers.add(run);
      if (state.type !== 'initial') run(state);
      return () => nsSubscribers.delete(run);
    },

    //
    //

    get() {
      return state;
    },

    //
    //

    dev: __DEV__
      ? {
          get subscribers() {
            return subscribers;
          },
          get nsSubscribers() {
            return nsSubscribers;
          },
          get values() {
            return values;
          },
          get started() {
            return started;
          },
          get unsubscribers() {
            return unsubscribers;
          },
        }
      : null,
  };
}
