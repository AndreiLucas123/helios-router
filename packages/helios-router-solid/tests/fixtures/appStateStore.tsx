import { RouterAppState, createAppState } from 'helios-router';

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
  routeExport: {
    root() {
      return <div>Loading...</div>;
    }
  }
});
