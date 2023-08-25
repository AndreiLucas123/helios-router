//
//

export type ISubscribable<T> = {
  get(): T;
  subscribe(callback: (value: T) => void): () => void;
};
