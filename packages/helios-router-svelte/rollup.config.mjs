import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import { preserveJSX, renameChunkPlugin } from 'so-rollup-plugins-utils';

//
//

const __DEV__ = !!process.env.ROLLUP_WATCH;

//
//

export default [
  {
    input: './src/solid.tsx',
    output: {
      file: './dist/index.jsx',
      format: 'es',
      sourcemap: false,
    },
    external: ['immer'],
    watch: {
      clearScreen: false,
      include: 'src/**',
    },
    plugins: [
      esbuild({
        sourceMap: false,
        minify: false,
      }),
      // babel({
      //   extensions: ['.tsx'],
      //   babelHelpers: 'bundled',
      //   presets: [['solid', { generate: 'ssr', hydratable: true }]],
      // }),
      preserveJSX(),
      renameChunkPlugin({
        oldName: 'solid.js',
        newName: 'solid.jsx',
      }),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: { file: 'dist/index.d.ts', format: 'es' },
    plugins: [dts()],
  },
];
