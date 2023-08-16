import { expect, test } from '@playwright/test';
import { getServiceFactory } from '../../src/old/getService';
import { loaderV3 } from '../../src/old/loaderV3';
import { GetServiceFunction } from '../../src/old/types';

//
//

test.beforeEach(() => {
  test.skip(true, 'Usando o LoaderV4');
});

//
//

let contador = 0;
function exampleService1() {
  return ++contador;
}

//
//

function exampleService2(getService: GetServiceFunction) {
  const service1 = getService(exampleService1);

  return `Service 1 output: ${service1}`;
}

//
//

test('loader deve usar service corretamente', () => {
  const getService = getServiceFactory(new Map());

  //
  //

  const loader = loaderV3(getService, () => {
    const service2 = getService(exampleService2);

    return service2;
  });

  //
  //

  loader.load();

  //
  //

  expect(loader.stage.get()).toBe('success');
  expect(loader.success.get()).toBe('Service 1 output: 1');
});
