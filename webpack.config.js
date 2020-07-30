/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'CCGram',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [{
      test: /\.(ts|js)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript',
          ],
          plugins: [
            '@babel/proposal-class-properties',
            '@babel/proposal-object-rest-spread',
            '@babel/plugin-transform-runtime',
          ],
        },
      },
    }],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ],
};
