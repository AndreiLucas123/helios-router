import { Page } from '@playwright/test';
import { TestUtilsKeys, TestUtilsRecord } from '../globals';

//
//

export function html(strings: TemplateStringsArray, ...values: any[]): string {
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }

  return result;
}

//
//

export function pageEvaluate<T extends TestUtilsKeys>(
  page: Page,
  functionName: T,
  ...args: Parameters<TestUtilsRecord[T]>
) {
  return page.evaluate(
    ([functionName, args]) => {
      // @ts-ignore
      window.__TEST_UTILS__[functionName](...args);
    },
    [functionName, args],
  );
}

//
//

export function waitMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
