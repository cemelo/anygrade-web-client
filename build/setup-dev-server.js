const path    = require('path');
const webpack = require('webpack');

const MemoryFileSystem = require('memory-fs');

const browserSync = require('browser-sync');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack/server.prod')
  : require('./webpack/server.dev');

module.exports = function setupDevServer(app, updateCallback) {
  // setup on the fly compilation + hot-reload
  webpackConfig.client.entry.app = ['webpack-hot-middleware/client',
    webpackConfig.client.entry.app];

  const bs = browserSync({
    open: false,
    notify: false,
  });

  app.use(require('connect-browser-sync')(bs));

  // Client middleware
  const clientCompiler = webpack(webpackConfig.client);
  app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: webpackConfig.client.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }));

  app.use(webpackHotMiddleware(clientCompiler));

  // watch and update server renderer
  const serverCompiler = webpack(webpackConfig.server);
  const fileSystem = new MemoryFileSystem();
  const outputPath = path.join(webpackConfig.server.output.path,
    webpackConfig.server.output.filename);

  serverCompiler.outputFileSystem = fileSystem;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;

    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    updateCallback(fileSystem.readFileSync(outputPath, 'utf-8'));
  });
};
