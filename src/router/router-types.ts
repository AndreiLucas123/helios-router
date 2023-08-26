import { AppState } from '../state-management/appState';

//
//

export type RouterAppState = {
  /**
   * State of the router
   * 
   * That object will be sended with SSR
   */
  router: {
    /**
     * The title of the page (for server-side rendering)
     */
    title?: string;

    /**
     * The meta tags of the page (for server-side rendering)
     */
    metas?: {
      name: string;
      content: string;
    }[];

    /**
     * The matched route
     * @example
     * `/users/:id`
     */
    routeMatched?: string;

    /**
     * The matched route params. Cames with `params` and `queryParams` from the url
     * @example
     * const currentUrl = `/users/123?foo=bar`
     * const matchedUrl = `/users/:id`
     * { id: '123', foo: 'bar' }
     */
    urlProps?: Record<string, string>;
  };

  /**
   * The default export of the route file
   * 
   * Is used by AppFrames to display their components
   * 
   * Will not be sended with SSR
   */
  routeExport?: RouteDefaultExport;
};

//
//

export type RouteLoader<T> = (appState: AppState<T>) => Promise<void>;

/**
 * The object that is exported by the route file
 */
export type RouteDefaultExport = {
  [key: string]: Function;
};

/**
 * Every route of the app
 *
 * Must be a Record and every route must have a default export
 */
export type Routes = {
  [x: string]: () => Promise<{
    default: RouteDefaultExport;
  }>;
};
