import type { RoutesConfigImports } from 'helios-router';

let routes: RoutesConfigImports = {
  '/fixtures': () => import('fixtures\rollup-routes-plugin\app\index.page.ts'),
  '/fixtures': () => import('fixtures\rollup-routes-plugin\app\$id\client.page.ts'),
  '/fixtures': () => import('fixtures\rollup-routes-plugin\app\$slug\index.page.ts'),
};

export default routes;
