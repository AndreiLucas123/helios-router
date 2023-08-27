/// <reference types="vite/client" />
import { setAppFrameConfigMethod } from '../../../src';
import { testUtils } from './fixture/main';

type TestUtilsRecord = ReturnType<typeof testUtils>;
type TestUtilsKeys = keyof TestUtilsRecord;

// Declare a nova propriedade no objeto global 'window'
declare global {
  const __TEST_UTILS__: TestUtilsRecord;

  interface Window {
    __TEST_UTILS__: TestUtilsRecord;
  }
}

//
//

interface ImportMetaEnv {
  readonly VITE_PLAYWRIGHT: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
