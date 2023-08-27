import { RouterAppState, createAppState } from '../../dist';

//
//

export interface AppStateStore extends RouterAppState {
  appLinkClicks: number;
}

//
//

export const appStateStore = createAppState<AppStateStore>({
  router: {},
  appLinkClicks: 0,
});
