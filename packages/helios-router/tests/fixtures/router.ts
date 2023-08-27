import { createHeliosRouter } from '../../dist/index';
import { appStateStore } from './appStateStore';

//
//

export const router = createHeliosRouter({
  appStateStore,
  routes: {
    '/about': () => import('./routes/about'),
    '/about-with-error': () => import('./routes/about-with-error'),
    '/*': () => import('./routes/not-found'),
  },
});
