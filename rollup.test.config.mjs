import esbuild from 'rollup-plugin-esbuild';
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import { babel } from '@rollup/plugin-babel';
import { hoistImportDeps } from './plugins/hoist-import-deps.js';

//
//

export default [
  {
    input: './fixtures/svelte/index.ts',
    output: { dir: 'dist-test/fixtures/svelte.js', format: 'es' },
    plugins: [
      esbuild({
        sourceMap: false,
        minify: false,
      }),

      // Imports the svelte
      commonjs(),
      nodeResolve({
        preferBuiltins: true,
        jsnext: true,
        // exportConditions: ['solid', 'node'],
      }),
      hoistImportDeps(),

      // Svelte and styles
      svelte(),
      postcss(),

      // For solid
      babel({
        extensions: ['.jsx', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['solid'],
      }),

      // Serve and livereload
      serve({
        port: 3039,
        historyApiFallback: true,
      }),
    ],
  },
];
