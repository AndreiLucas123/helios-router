import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import babel from '@rollup/plugin-babel';

//
//

const __DEV__ = !!process.env.ROLLUP_WATCH;

//
//

export default [
  {
    input: './tests/fixtures/fixture-index.tsx',
    output: {
      dir: './tests/fixtures/static/dist',
      format: 'es',
      sourcemap: false,
    },
    external: [],
    watch: {
      clearScreen: false,
      include: 'tests/fixtures/**',
    },
    plugins: [
      commonjs(),
      nodeResolve({
        browser: true,
        // For solid
        exportConditions: ['solid', 'node'],
      }),

      esbuild({
        sourceMap: false,
        minify: false,
        jsx: 'preserve',
      }),

      replace({
        preventAssignment: true,
        __DEV__: 'true',
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),

      // For solid
      babel({
        extensions: ['.jsx', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['solid'],
      }),

      __DEV__ &&
        serve({
          contentBase: './tests/fixtures/static',
          historyApiFallback: true,
          port: 3040,
        }),
    ],
  },
];
