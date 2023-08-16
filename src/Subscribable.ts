import { ISubscribable } from './types';

export class Subscribable<T> implements ISubscribable<T> {
  protected _value: T;
  protected _subscribers = new Set<(value: T) => void>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get(): T {
    return this._value;
  }

  set(value: T): void {
    if (this._value === value) return;
    this._value = value;
    this._subscribers.forEach((callback) => callback(value));
  }

  subscribe(callback: (value: T) => void) {
    callback(this._value);
    this._subscribers.add(callback);

    return () => {
      this._subscribers.delete(callback);
    };
  }
}

//
//

export class ThrowableSubscribable<T> extends Subscribable<T> {
  constructor() {
    super(null as any);
  }

  get(): T {
    if (this._value === null) throw new Error('Cannot get value before set');
    return this._value;
  }

  subscribe(callback: (value: T) => void) {
    callback(this.get());
    this._subscribers.add(callback);

    return () => {
      this._subscribers.delete(callback);
    };
  }
}
