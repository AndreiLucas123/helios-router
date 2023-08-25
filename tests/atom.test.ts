import './utils/dev';
import { expect, test } from '@playwright/test';
import { atom } from '../dist';

test('Deve emitir o valor registrado ao se subscrever', () => {
  let _value = 0;

  const subscribable = atom(1);

  subscribable.subscribe((value) => {
    _value = value;
  });

  expect(_value).toBe(1);
});

//
//

test('Não deve emitir o valor se o valor for o mesmo', () => {
  let _value = 0;
  let emmitedTimes = 0;

  const subscribable = atom(1);

  subscribable.subscribe((value) => {
    _value = value;
    emmitedTimes++;
  });

  expect(_value).toBe(1);
  expect(emmitedTimes).toBe(1);

  subscribable.set(1);

  expect(_value).toBe(1);
  expect(emmitedTimes).toBe(1);
});

//
//

test('1 - Deve manter a ordem de subscrição corretamente caso alguém remova sua subscrição no meio do setting', () => {
  /**
   * Esse Irá remover o valor2 antes de emitir o valor3
   * Então o valor3 deverá ser definido corretamente
   */
  let _value1 = 0;
  let _value2 = 0;
  let _value3 = 0;

  const subscribable = atom(1);

  const unubscription1 = subscribable.subscribe((value) => (_value1 = value));
  const unubscription2 = subscribable.subscribe((value) => {
    if (_value3) unubscription2(); // Remove a subscrição, caso o valor3 já tenha sido setado
    _value2 = value;
  });
  const unubscription3 = subscribable.subscribe((value) => (_value3 = value));

  expect([_value1, _value2, _value3]).toEqual([1, 1, 1]);

  subscribable.set(2);

  expect([_value1, _value2, _value3]).toEqual([2, 2, 2]);
});

//
//

test('2 - Deve manter a ordem de subscrição corretamente caso alguém remova sua subscrição no meio do setting', () => {
  /**
   * Esse irá remover o valor1 antes de emitir o valor2
   * Então o valor2 deverá ser definido corretamente
   */
  let _value1 = 0;
  let _value2 = 0;
  let _value3 = 0;

  const subscribable = atom(1);

  const unubscription1 = subscribable.subscribe((value) => {
    if (_value3) unubscription1(); // Remove a subscrição, caso o valor3 já tenha sido setado
    _value1 = value;
  });
  const unubscription2 = subscribable.subscribe((value) => (_value2 = value));
  const unubscription3 = subscribable.subscribe((value) => (_value3 = value));

  expect([_value1, _value2, _value3]).toEqual([1, 1, 1]);

  subscribable.set(2);

  expect([_value1, _value2, _value3]).toEqual([2, 2, 2]);
});

//
//

test('3 - Deve manter a ordem de subscrição corretamente caso alguém remova sua subscrição no meio do setting', () => {
  /**
   * Esse irá remover o valor2 antes de emitir o valor2
   * Então o valor2 não deverá será mudado
   */
  let _value1 = 0,
    _value2 = 0,
    _value3 = 0;

  const subscribable = atom(1);

  const unubscription1 = subscribable.subscribe((value) => {
    if (_value3) unubscription2(); // Remove a subscrição, caso o valor3 já tenha sido setado
    _value1 = value;
  });
  const unubscription2 = subscribable.subscribe((value) => (_value2 = value));
  const unubscription3 = subscribable.subscribe((value) => (_value3 = value));

  expect([_value1, _value2, _value3]).toEqual([1, 1, 1]);

  subscribable.set(2);

  expect([_value1, _value2, _value3]).toEqual([2, 1, 2]);
});

//
//

test('Não deve receber valor caso saia da subscrição', () => {
  let _value = 0;

  const subscribable = atom(1);

  const unubscription1 = subscribable.subscribe((value) => {
    _value = value;
  });

  expect(_value).toBe(1);

  //

  unubscription1();

  subscribable.set(2);

  expect(_value).toBe(1);
  expect(subscribable.dev!.subscribers.size).toBe(0);
  expect(subscribable.dev!.value).toBe(2);
});
