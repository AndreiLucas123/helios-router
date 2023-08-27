import { createHeliosRouter } from '../../dist/index';
import { appStateStore } from './appStateStore';

//
//

export const router = createHeliosRouter({
  appStateStore,
  routes: {
    '/about': () => import('./routes/about'),
    '/*': () => import('./routes/not-found'),
  },
});
