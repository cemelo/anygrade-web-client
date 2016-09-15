const webpack = require('webpack');
const path    = require('path');

const I18nPlugin = require("i18n-webpack-plugin");

const config  = require('../config');
const utils   = require('../utils');

const projectRoot = path.resolve(__dirname, '../../');

module.exports = {
  entry: {
    app: path.join(projectRoot, '/src/entrypoint-client.js'),
    vendor: [
      'vue',
      'vue-router',
      'vuex',
      'es6-promise',
      'phoenix',
      'dialog-polyfill',
      'css-element-queries',
      'node-polyglot',
    ],
  },

  // Libraries fetched from a CDN
  externals: {
    modernizr: 'Modernizr',
    velocity: 'Velocity',
  },

  output: {
    path: path.resolve(projectRoot, '/dist'),
    publicPath: '/dist/',
    filename: 'client-bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      components: path.join(projectRoot, 'src/components'),
      locale: path.join(projectRoot, 'locale/pt-BR'),
    },
  },

  resolveLoader: {
    root: path.join(__dirname, '../node_modules'),
    fallback: [path.join(__dirname, '../node_modules')],
  },

  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.html$/,
        loader: 'vue-html',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },

  eslint: {
    formatter: require('eslint-friendly-formatter'),
  },

  vue: {
    loaders: utils.cssLoaders(),
    autoprefixer: false,
    postcss: [
      require('doiuse')({
        browsers: ['last 2 versions', '> 1% in BR', 'ie >= 10'],
        ignore: ['rem', 'viewport-units'],
      }),

      require('postcss-cssnext')({
        browsers: ['ie >= 10', '> 1%'],
      }),

      require('postcss-reporter')(),
    ],
  },
};
