import { RouterAppState, createAppState } from '../../dist';

//
//

export interface AppStateStore extends RouterAppState {}

//
//

export const appStateStore = createAppState<AppStateStore>({
  router: {},
});
