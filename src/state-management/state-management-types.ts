//
//

export type IReadable<T> = {
  /**
   * Get the current value of the IReadable.
   */
  get(): T;
  /**
   * Subscribe to value changes.
   */
  subscribe(callback: (value: T) => void): () => void;
};

//
//

export interface IWritable<T> extends IReadable<T> {
  /**
   * Change and notify subscribers of a new value.
   * @param newValue Set a new value to the store.
   */
  set(newValue: T): void;
}
