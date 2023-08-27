import { createHeliosRouter } from 'helios-router';
import { appStateStore } from './appStateStore';

//
//

export const router = createHeliosRouter({
  appStateStore,
  routes: {
    '/': () => import('./routes/home'),
    '/home': () => import('./routes/home'),
    '/about': () => import('./routes/about'),
    '/create-on-effect-test': () => import('./routes/create-on-effect-test'),
    '/client/:id': () => import('./routes/client'),
    '/*': () => import('./routes/not-found'),
  },
});
