import esbuild from 'rollup-plugin-esbuild';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';

//
//

const __DEV__ = !!process.env.ROLLUP_WATCH;

//
//

export default [
  {
    input: './tests/fixtures/fixture-index.ts',
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
      nodeResolve({
        browser: true,
      }),
      esbuild({
        sourceMap: false,
        minify: false,
      }),
      replace({
        preventAssignment: true,
        __DEV__: 'true',
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      __DEV__ &&
        serve({
          contentBase: './tests/fixtures/static',
          historyApiFallback: true,
          port: 3039,
        }),
    ],
  },
];
