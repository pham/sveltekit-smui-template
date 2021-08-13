import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import fs from 'fs';
import cssnano from 'cssnano';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (/Skipping CSS/.test(warning.message)) ||
  (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
  (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);

const postcssOptions = light => ({
  extensions: ['.scss'],
  extract: 'smui.css',
  minimize: true,
  onExtract: light
    ? null
    : getExtracted => {
      const { code } = getExtracted();
      cssnano()
        .process(code, { from: undefined })
        .then(({ css }) => {
          const filename = `${config.client.output().dir}/smui-dark.css`;
          fs.writeFileSync(filename, css);
        });
      return false;
    },
  use: [
    ['sass', {
      includePaths: [ `./src/theme${light ? '' : '/dark'}`, './node_modules' ]
    }]
  ]
});

const replaceOptions = (browser = true) => ({
  preventAssignment: true,
  values: {
    'process.browser': browser,
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
});

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace(replaceOptions()),
      svelte({
        compilerOptions: {
          dev,
          hydratable: true
        },
      }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      postcss(postcssOptions(true)),

      legacy && babel({
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        babelHelpers: 'runtime',
        exclude: ['node_modules/@babel/**'],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-transform-runtime', {
            useESModules: true
          }]
        ]
      }),

      !dev && terser({
        module: true
      })
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace(replaceOptions(false)),
      svelte({
        compilerOptions: {
          dev,
          hydratable: true,
          generate: 'ssr',
        },
        emitCss: false,
      }),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
      postcss(postcssOptions()),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules || Object.keys(process.binding('natives'))
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace(replaceOptions()),
      commonjs(),
      !dev && terser()
    ],

    preserveEntrySignatures: false,
    onwarn,
  }
};
