'use strict';

const path = require('path');

/** @type {import('bili').Config} */
module.exports = {
  output: {
    format: ['cjs', 'es', 'iife', 'iife-min'],
    // TODO: Figure out how to fix `rollup-plugin-vue` issue with sourcemaps in
    //       watch mode: https://github.com/vuejs/rollup-plugin-vue/issues/238
    sourceMap: false
  },
  bundleNodeModules: ['rollup-plugin-vue', 'vue-runtime-helpers'],
  plugins: {
    'tailor-ce': true,
    vue: true,
    postcss: {
      extract: 'dist/tcc-exam.css'
    },
    babel: {
      runtimeHelpers: true,
      sourceMap: true,
      extensions: ['.js', '.vue']
    },
    alias: {
      resolve: ['.scss', '.vue', '.js'],
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') }
      ]
    }
  },
  resolvePlugins: {
    'tailor-ce': require('@extensionengine/rollup-plugin-tailor-ce')
  }
};
