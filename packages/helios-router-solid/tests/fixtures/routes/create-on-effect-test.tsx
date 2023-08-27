import { createSignal } from 'solid-js';
import { createOnEffect } from '../../../dist';
import { RoutePlaceholder } from '../RoutePlaceholder';
import { NavComponent } from './NavComponent';

export default {
  root: () => {
    const [updateCount, setUpdateCount] = createSignal(0);
    const [click1, setClick1] = createSignal(0);
    const [click2, setClick2] = createSignal(0);

    createOnEffect([click1, click2], () => {
      setUpdateCount((prev) => prev + 1);
    });

    return (
      <div>
        <div>CreateOnEffectTest</div>
        <div onclick={() => setClick1((prev) => prev + 1)}>
          Click to update single value, {click1()}
        </div>
        <div
          onclick={() => {
            setClick1((prev) => prev + 1);
            setClick2((prev) => prev + 1);
          }}
        >
          Click to update two values, {click1()} and {click2()}
        </div>
        <div>Update count: {updateCount()}</div>
        <RoutePlaceholder id='link' />
      </div>
    );
  },
  //
  link: NavComponent,
};
