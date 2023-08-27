import { RoutePlaceholder } from '../RoutePlaceholder';
import { NavComponent } from './NavComponent';

export default {
  root: () => {
    return (
      <div>
        <div>Not Found</div>
        <RoutePlaceholder id='link' />
      </div>
    );
  },
  //
  link: NavComponent,
};
