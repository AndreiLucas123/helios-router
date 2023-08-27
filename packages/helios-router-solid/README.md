# helios-router-solid

Contains `RoutePlaceholder` and three utilities:

- `createOnEffect`
- `useSolidSubscribe`
- `effectCleanup`

## RoutePlaceholder

You need to create the `RoutePlaceholder` like the example

Where the `appStateStore` is your local store

```ts
import { createSolidRoutePlaceholder } from 'helios-router-solid';
import { appStateStore } from './appStateStore';

export const RoutePlaceholder = createSolidRoutePlaceholder(appStateStore);
```

## createOnEffect

It is like solid `createEffect`, but with more than one accessor it batchs to avoid multiple calls

It is used to explicitly track the signals like React `useEffect`

```ts
createOnEffect([siganl1, siganl2], () => {
  setEffectsCount((prev) => prev + 1);
});
```

## useSolidSubscribe

Converts a subscribable/IReadable into a solid signal

Very simple to use

```ts
const appState = useSolidSubscribe(appStateStore);
```

## effectCleanup

Used to cleanup a effect like React `useEffect`

```ts
const cleanup = effectCleanup();

createOnEffect([siganl1, siganl2], () => {
  cleanup(() => console.log('Some cleanup'));

  // ...
});
```
