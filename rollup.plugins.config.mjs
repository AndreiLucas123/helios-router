import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

//
//

const __DEV__ = !!process.env.ROLLUP_WATCH;
const addons = [];

//
//

if (!__DEV__) {
  //
  //  Add the typescript definition file build
  addons.push({
    input: './dist-test/types/rollup-routes-plugin/index.d.ts',
    output: { file: 'dist/rollup-routes-plugin.d.ts', format: 'es' },
    plugins: [dts()],
  });
}

//
//

export default [
  {
    input: './src/rollup-routes-plugin/index.ts',
    output: { file: 'dist/rollup-routes-plugin.js', format: 'es' },
    external: ['node:path', 'node:fs/promises', 'chokidar'],
    plugins: [
      esbuild({
        sourceMap: false,
        minify: false,
      }),
    ],
  },
  ...addons,
];
