import type { RoutesConfigImports } from '../../dist';

export default {
  '/': () => import('./app/page'),
  '/home': () => import('./app/home/page'),
  '/about': () => import('./app/about/page'),
  '/client/:id': () => import('./app/client/$id/page'),
  '/*': () => import('./app/$slug/page'),
} satisfies RoutesConfigImports;
