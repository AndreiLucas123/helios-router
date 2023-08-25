export type RouterAppState = {
  /**
   * AppState of the router
   * 
   * If you want to change a route props state, you should put it outside of the routerAppState
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
    urlProps: {
      [key: string]: string;
    };
  };
};
