import './utils/dev';
import { expect, test } from '@playwright/test';
import { atom, selector } from '../dist';

//
//

test('O selector deve emitir o valor registrado do atom ao se subscrever', () => {
  let _value = 0;

  const _atom = atom(1);
  const _selector = selector(_atom, (value) => value);

  _selector.subscribe((value) => {
    _value = value;
  });

  expect(_value).toBe(1);
});

//
//

test('O seletor deve só se increver no atom, caso o seletor tenha um subscriber', () => {
  const _atom = atom(1);
  const _selector = selector(_atom, () => {});

  expect(_selector.dev!.subscribers.size).toBe(0);
  expect(_atom.dev!.subscribers.size).toBe(0);

  const unubscription1 = _selector.subscribe(() => {});

  expect(_selector.dev!.subscribers.size).toBe(1);
  expect(_atom.dev!.subscribers.size).toBe(1);

  //

  unubscription1();

  expect(_selector.dev!.subscribers.size).toBe(0);
  expect(_atom.dev!.subscribers.size).toBe(0);
});

//
//

test('O selector não deve emitir o valor se o valor for o mesmo', () => {
  let _value = 0;
  let emmitedTimes = 0;

  const _atom = atom(1);
  const _selector = selector(_atom, (value) => value);

  _selector.subscribe((value) => {
    _value = value;
    emmitedTimes++;
  });

  expect(_value).toBe(1);
  expect(emmitedTimes).toBe(1);

  _atom.set(1);

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

  const _atom = atom(1);
  const _selector = selector(_atom, (value) => value);

  const unubscription1 = _selector.subscribe((value) => (_value1 = value));
  const unubscription2 = _selector.subscribe((value) => {
    if (_value3) unubscription2(); // Remove a subscrição, caso o valor3 já tenha sido setado
    _value2 = value;
  });
  const unubscription3 = _selector.subscribe((value) => (_value3 = value));

  expect([_value1, _value2, _value3]).toEqual([1, 1, 1]);

  _atom.set(2);

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

  const _atom = atom(1);
  const _selector = selector(_atom, (value) => value);

  const unubscription1 = _selector.subscribe((value) => {
    if (_value3) unubscription1(); // Remove a subscrição, caso o valor3 já tenha sido setado
    _value1 = value;
  });
  const unubscription2 = _selector.subscribe((value) => (_value2 = value));
  const unubscription3 = _selector.subscribe((value) => (_value3 = value));

  expect([_value1, _value2, _value3]).toEqual([1, 1, 1]);

  _atom.set(2);

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

  const _atom = atom(1);
  const _selector = selector(_atom, (value) => value);

  const unubscription1 = _selector.subscribe((value) => {
    if (_value3) unubscription2(); // Remove a subscrição, caso o valor3 já tenha sido setado
    _value1 = value;
  });
  const unubscription2 = _selector.subscribe((value) => (_value2 = value));
  const unubscription3 = _selector.subscribe((value) => (_value3 = value));

  expect([_value1, _value2, _value3]).toEqual([1, 1, 1]);

  _atom.set(2);

  expect([_value1, _value2, _value3]).toEqual([2, 1, 2]);
});

//
//

test('Não deve receber valor caso saia da subscrição', () => {
  let _value = 0;

  const _atom = atom(1);
  const _selector = selector(_atom, (value) => value);

  const unubscription1 = _selector.subscribe((value) => {
    _value = value;
  });

  expect(_value).toBe(1);

  //

  unubscription1();

  _atom.set(2);

  expect(_value).toBe(1);
  expect(_selector.dev!.subscribers.size).toBe(0);
  expect(_atom.dev!.subscribers.size).toBe(0);
  expect(_selector.dev!.fromValue).toBe(1); // Will not update, because _selector will not be subscribed to _atom
  expect(_selector.dev!.value).toBe(1); // Will not update, because _selector will not be subscribed to _atom
});
