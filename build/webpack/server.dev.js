const path    = require('path');
const webpack = require('webpack');
const merge   = require('webpack-merge');

const utils   = require('../utils');

const baseWebpackConfig = require('./base');

const projectRoot = path.resolve(__dirname, '../../');

const clientConfig = merge(baseWebpackConfig, {
  devtool: '#eval-source-map',

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),

    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'client-vendor-bundle.js'
    }),
  ],
});

const serverConfig = Object.assign({}, baseWebpackConfig, {
  target: 'node',
  devtool: null,
  entry: path.join(projectRoot, 'src/entrypoint-server.js'),
  output: Object.assign({}, baseWebpackConfig.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }),

  externals: Object.keys(require('../../package.json').dependencies),

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.VUE_ENV': '"server"'
    }),
    new webpack.ProvidePlugin({
      WebSocket: 'ws',
    }),
  ],
});

module.exports = {
  client: clientConfig,
  server: serverConfig,
};
