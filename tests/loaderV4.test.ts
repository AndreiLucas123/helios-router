import './utils/dev';
import { expect, test } from '@playwright/test';
import { Subscribable, INITIAL, loader as loaderV4 } from '../dist';
import { waitMs } from './utils/utils';

//
//

type SubscribableType = { type?: string; value: number };

//
//

test('Deve ser iniciado com as características corretas', () => {
  const loader = loaderV4([], () => 1);

  expect(loader.dev).toEqual({
    subscribers: new Set(),
    nsSubscribers: new Set(),
    values: [],
    started: false,
    unsubscribers: null,
  });
  expect(loader.get()).toBe(INITIAL);
});

//
//

test('Deve se inscrever corretamente, mas não iniciar', () => {
  const sub1 = new Subscribable(0);

  //
  //

  const loader = loaderV4([sub1], () => 1);

  //
  //

  expect(loader.dev!.values).toEqual([]);
  expect(loader.dev!.started).toBe(false);
  expect(loader.dev!.subscribers.size).toBe(0);
  expect(loader.get()).toBe(INITIAL);
});

//
//

test('Deve iniciar quando alguém subscriver ao loader', () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 12 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1], () => 1);

  //
  //

  loader.subscribe((value) => stages.push(value.type));

  //
  //

  expect(loader.dev!.values).toEqual([{ value: 12 }]);
  expect(loader.dev!.started).toBe(true);
  expect(loader.dev!.subscribers.size).toBe(1);

  expect(stages).toEqual(['success']);

  expect(loader.get()).toEqual({
    type: 'success',
    data: 1,
  });
});

//
//

test('Deve ficar com LOADING caso a função seja assíncrona', async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 12 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1], async () => 1);

  //
  //

  loader.subscribe((value) => stages.push(value.type));
  await waitMs(20);

  //
  //

  expect(loader.dev!.values).toEqual([{ value: 12 }]);
  expect(loader.dev!.started).toBe(true);
  expect(loader.dev!.subscribers.size).toBe(1);

  expect(stages).toEqual(['loading', 'success']);

  expect(loader.get()).toEqual({
    type: 'success',
    data: 1,
  });
});

//
//

test('Deve entregar o objeto de cada dependencia', () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 1 });
  const sub2 = new Subscribable({ value: 2 });
  const sub3 = new Subscribable({ value: 3 });
  let delivered: any[] = [];
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1, sub2, sub3], (array) => {
    delivered = array;
  });

  //
  //

  loader.subscribe((value) => stages.push(value.type));

  //
  //

  expect(delivered).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
  expect(stages).toEqual(['success']);

  expect(loader.get()).toEqual({
    type: 'success',
    data: undefined, // undefined porque não retornou nada
  });
});

//
//

test('nsSubscribe não deve dar start caso se subscreva', () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 12 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1], () => 1);

  //
  //

  loader.nsSubscribe((value) => stages.push(value.type));

  //
  //

  expect(loader.dev!.values).toEqual([]);
  expect(loader.dev!.started).toBe(false);
  expect(loader.dev!.subscribers.size).toBe(0);
  expect(loader.dev!.nsSubscribers.size).toBe(1);
  expect(stages).toEqual([]);

  expect(loader.get()).toEqual(INITIAL);
});

//
//

test('Quando uma dependencia mudar, deve notificar', async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 1 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1], () => 1);

  //
  //

  loader.subscribe((value) => stages.push(value.type));

  //
  //

  expect(loader.dev!.values).toEqual([{ value: 1 }]);
  expect(stages).toEqual(['success']);

  //
  //

  sub1.set({ value: 2 });

  // Wait for next tick, because of batch
  await Promise.resolve();

  //

  expect(loader.dev!.values).toEqual([{ value: 2 }]);
  expect(stages).toEqual(['success', 'success']);
});

//
//

test('Quando múltiplas dependencias mudarem, deve notificar uma única vez', async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 1 });
  const sub2 = new Subscribable({ value: 1 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1, sub2], () => 1);

  //
  //

  loader.subscribe((value) => stages.push(value.type));

  //
  //

  expect(loader.dev!.values).toEqual([{ value: 1 }, { value: 1 }]);
  expect(stages).toEqual(['success']);

  //
  //

  sub1.set({ value: 2 });
  sub2.set({ value: 2 });

  // Wait for next tick, because of batch
  await Promise.resolve();

  //

  expect(loader.dev!.values).toEqual([{ value: 2 }, { value: 2 }]);
  expect(stages).toEqual(['success', 'success']);
});

//
//

test('Quando múltiplas dependencias mudarem de forma, deve notificar uma única vez', async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 1 });
  const sub2 = new Subscribable({ value: 1 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1, sub2], async () => 1);

  //
  //

  loader.subscribe((value) => stages.push(value.type));

  //
  //

  expect(loader.dev!.values).toEqual([{ value: 1 }, { value: 1 }]);
  expect(stages).toEqual(['loading']);

  await Promise.resolve();
  expect(stages).toEqual(['loading', 'success']);

  //
  //

  sub1.set({ value: 2 });
  sub2.set({ value: 2 });

  // Wait for next tick, because of batch
  await Promise.resolve();

  //

  expect(loader.dev!.values).toEqual([{ value: 2 }, { value: 2 }]);
  expect(stages).toEqual(['loading', 'success', 'loading']);

  // Wait for next tick, because of batch
  await Promise.resolve();
  expect(stages).toEqual(['loading', 'success', 'loading', 'success']);
});

//
//

test('Quando uma dependencia dá erro, ele continua no erro', async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable<SubscribableType>({ type: 'error', value: 1 });
  const sub2 = new Subscribable({ value: 1 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1, sub2], () => 1);

  //
  //

  loader.subscribe((value) => stages.push(value.type));

  //
  //

  expect(loader.dev!.values).toEqual([
    { type: 'error', value: 1 },
    { value: 1 },
  ]);
  expect(stages).toEqual(['error']);

  //
  //

  sub1.set({ type: 'error', value: 2 });
  sub2.set({ value: 2 });

  // Wait for next tick, because of batch
  await Promise.resolve();
  expect(stages).toEqual(['error', 'error']);

  //
  //

  sub1.set({ value: 3 });
  sub2.set({ value: 3 });

  expect(loader.dev!.values).toEqual([{ value: 3 }, { value: 3 }]);
  expect(stages).toEqual(['error', 'error']);

  // Wait for next tick, because of batch
  await Promise.resolve();
  expect(stages).toEqual(['error', 'error', 'success']);
});

//
//

test('Deve não receber o valor cancelado', async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 10 });
  let stages: string[] = [];
  let values: number[] = [];

  //
  //

  const loader = loaderV4([sub1], async ([{ value }]) => {
    await waitMs(value);
    return value;
  });

  //
  //

  loader.nsSubscribe((value) => {
    stages.push(value.type);
  });
  expect(stages).toEqual([]);

  //
  //

  loader.subscribe((value: any) => {
    values.push(value.value);
  });
  expect(stages).toEqual(['loading']);

  //
  //

  await waitMs(15);
  expect(stages).toEqual(['loading', 'success']);

  //
  //

  sub1.set({ value: 40 });

  //
  //

  await Promise.resolve();
  expect(stages).toEqual(['loading', 'success', 'loading']);

  //
  //

  sub1.set({ value: 20 });

  //
  //

  await waitMs(50);

  //

  expect(loader.dev!.values).toEqual([{ value: 20 }]); // Must be the last value
  expect(stages).toEqual(['loading', 'success', 'loading', 'success']);
});

//
//

test("Quando der erro de maneira sincrona, ele deve retornar o objeto.type === 'error'", () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 10 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1], () => {
    throw new Error('Erro sincrono');
  });

  //
  //

  loader.subscribe((value: any) => {
    stages.push(value.type);
  });
  expect(stages).toEqual(['error']);

  //

  expect(loader.dev!.values).toEqual([{ value: 10 }]);
});

//
//

test("Quando der erro de maneira assíncrona, ele deve retornar o objeto.type === 'error'", async () => {
  //
  // Loader only accepts subscribables that returns objects
  const sub1 = new Subscribable({ value: 10 });
  let stages: string[] = [];

  //
  //

  const loader = loaderV4([sub1], async () => {
    await Promise.resolve();
    throw new Error('Erro assíncrona');
  });

  //
  //

  loader.subscribe((value: any) => {
    stages.push(value.type);
  });

  await waitMs(0);
  expect(stages).toEqual(['loading', 'error']);

  //

  expect(loader.dev!.values).toEqual([{ value: 10 }]);
});
