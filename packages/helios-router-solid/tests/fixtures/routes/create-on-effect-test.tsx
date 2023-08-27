import { createSignal } from 'solid-js';
import { createOnEffect } from '../../../dist';
import { RoutePlaceholder } from '../RoutePlaceholder';
import { NavComponent } from './NavComponent';

export default {
  root: () => {
    const [effectsCount, setEffectsCount] = createSignal(0);
    const [click1, setClick1] = createSignal(0);
    const [click2, setClick2] = createSignal(0);

    createOnEffect([click1, click2], () => {
      setEffectsCount((prev) => prev + 1);
    });

    return (
      <div>
        <div>CreateOnEffectTest</div>
        <button onclick={() => setClick1((prev) => prev + 1)}>
          Click to update single value, {click1()}
        </button>
        <button
          onclick={() => {
            setClick1((prev) => prev + 1);
            setClick2((prev) => prev + 1);
          }}
        >
          Click to update two values, {click1()} and {click2()}
        </button>
        <div>Effects count: {effectsCount()}</div>
        <RoutePlaceholder id='link' />
      </div>
    );
  },
  //
  link: NavComponent,
};
