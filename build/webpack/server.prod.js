const path    = require('path');
const webpack = require('webpack');
const merge   = require('webpack-merge');

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require('../config');
const utils  = require('../utils');

const baseWebpackConfig = require('./base');

const projectRoot = path.resolve(__dirname, '../../');

const clientConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true }),
  },

  devtool: config.build.productionSourceMap ? '#source-map' : false,

  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },

  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
    }),
  },

  plugins: [

    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'client-vendor-bundle.js'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    // minify with dead-code elimination
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // optimize module ids by occurence count
    new webpack.optimize.OccurenceOrderPlugin(),

    // extract css into its own file
    new ExtractTextPlugin(utils.assetsPath('css/styles.css')),
  ],
});

const serverConfig = Object.assign({}, base, {
  target: 'node',
  devtool: null,
  entry: path.join(projectRoot, '/src/entrypoint-server.js'),

  output: Object.assign({}, base.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }),

  externals: Object.keys(require('../../package.json').dependencies),

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.VUE_ENV': '"server"'
    }),
  ],
});

module.exports = {
  client: clientConfig,
  server: serverConfig,
};
