import { RoutePlaceholder } from '../RoutePlaceholder';
import { NavComponent } from './NavComponent';

export default {
  root: () => {
    return (
      <div>
        <div>Home</div>
        <RoutePlaceholder id='link' />
      </div>
    );
  },
  //
  link: NavComponent,
};
