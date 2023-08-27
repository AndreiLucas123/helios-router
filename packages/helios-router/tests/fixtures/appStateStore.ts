import { RouterAppState, appState } from '../../dist';

//
//

export interface AppStateStore extends RouterAppState {}

//
//

export const appStateStore = appState<AppStateStore>({
  router: {},
});
