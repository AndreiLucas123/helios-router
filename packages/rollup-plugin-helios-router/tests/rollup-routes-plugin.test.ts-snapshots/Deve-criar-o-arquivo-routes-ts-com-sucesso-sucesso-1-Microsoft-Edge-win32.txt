let routes = {
  '/': () => import('./index.page'),
  '/arroz': () => import('./arroz/index.page'),
  '/arroz/:id': () => import('./arroz/$id/client.page'),
  '/arroz/*': () => import('./arroz/$slug/index.page'),
  '/:id': () => import('./$id/client.page'),
  '/*': () => import('./$slug/index.page'),
};

if (__DEV__) {
  routes = {
    '/dev': () => import('./dev/index.page'),
    ...routes
  } as any;
}

export default routes;
