import { expect, test } from '@playwright/test';
import { GetServiceFunction } from '../../src/old/types';
import { getServiceFactory } from '../../src/old/getService';

//
//

test.beforeEach(() => {
  test.skip(true);
});

//
//

function service(getService: GetServiceFunction) {
  return {
    getService,
    msg: 'test',
  };
}

//
//

test('Deve pegar o serviço com sucesso usando "getService"', () => {
  const getService: GetServiceFunction = getServiceFactory(new Map());

  const testObj = getService(service);

  expect(testObj).toEqual({
    getService,
    msg: 'test',
  });
});

//
//

test('A instancia do serviço deve ser mantida no Map e reusada', () => {
  const servicesMap = new Map();

  const getService: GetServiceFunction = getServiceFactory(servicesMap);

  const testObj1 = getService(service);
  expect(servicesMap.size).toBe(1);

  const testObj2 = getService(service);
  expect(servicesMap.size).toBe(1);

  expect(testObj1).toBe(testObj2);
});
