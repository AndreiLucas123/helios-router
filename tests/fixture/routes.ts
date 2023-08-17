import type { RoutesConfigImports } from '../../dist';

export default {
  '/': () => import('./app/home/home.page'),
  '/home': () => import('./app/home/home.page'),
  '/about': () => import('./app/about/about.page'),
  '/client/:id': () => import('./app/client/$id/client-id.page'),
  '/*': () => import('./app/$slug/not-found.page'),
} satisfies RoutesConfigImports;
