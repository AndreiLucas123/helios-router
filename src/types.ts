export type RoutesConfigImports = Record<
  string,
  () => Promise<{ default: RouteConfig }>
>;

/**
 * Each key is the name of a app-frame in the route.
 */
export type RouteConfig = {
  [key: string]: unknown;
};

//
//

export type ISubscribable<T> = {
  get(): T;
  subscribe(callback: (value: T) => void): () => void;
};

//
//

export type PageProps = Record<string, unknown>;
