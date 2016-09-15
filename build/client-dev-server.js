var browserSync = require('browser-sync');
var webpack     = require('webpack');

var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var historyApiFallback   = require('connect-history-api-fallback');

var config = require('./config');
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack/client.prod')
  : require('./webpack/client.dev');

var port = process.env.PORT || config.dev.port;

// Proxy tables?

var bundler = webpack(webpackConfig);

var devMiddleware = webpackDevMiddleware(bundler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false,
  },
});

var hotMiddleware = webpackHotMiddleware(bundler);

browserSync({
  server: {
    baseDir: '.',

    middleware: [
      historyApiFallback(),
      devMiddleware,
      hotMiddleware,
    ],
  },

  open: false,
  notify: false,

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'app/css/*.css',
    'app/*.html',
    'app/*.pug',
  ],
});
