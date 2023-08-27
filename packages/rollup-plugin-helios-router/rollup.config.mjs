import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

//
//

const __DEV__ = !!process.env.ROLLUP_WATCH;

//
//

export default [
  {
    input: './src/index.ts',
    output: { file: 'dist/index.js', format: 'es' },
    external: ['node:path', 'node:fs/promises', 'chokidar'],
    plugins: [
      esbuild({
        sourceMap: false,
        minify: false,
      }),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [dts()],
  },
];
