import { createHeliosRouter } from '../../dist/index';
import { appStateStore } from './appStateStore';

//
//

export const router = createHeliosRouter({
  appStateStore,
  routes: {
    '/': () => import('./routes/home'),
    '/home': () => import('./routes/home'),
    '/about': () => import('./routes/about'),
    '/client/:id': () => import('./routes/client'),
    '/about-with-error': () => import('./routes/about-with-error'),
    '/*': () => import('./routes/not-found'),
  },
});
