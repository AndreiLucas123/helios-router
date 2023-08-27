import { useSolidSubscribe } from '../../../dist';
import { RoutePlaceholder } from '../RoutePlaceholder';
import { appStateStore } from '../appStateStore';
import { NavComponent } from './NavComponent';

//
//

export default {
  root: () => {
    const appState = useSolidSubscribe(appStateStore);

    return (
      <div>
        <div>Client id: {appState().router.urlProps?.id}</div>
        <RoutePlaceholder id='link' />
      </div>
    );
  },
  //
  link: NavComponent,
};
