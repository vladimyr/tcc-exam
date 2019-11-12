'use strict';

const path = require('path');

/** @type {import('bili').Config} */
module.exports = {
  input: './src/util.js',
  output: {
    format: 'cjs',
    sourceMap: false
  },
  plugins: {
    alias: {
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') }
      ]
    }
  }
};
