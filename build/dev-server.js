const fs    = require('fs');
const path  = require('path');

const express   = require('express');
const favicon   = require('serve-favicon');
const serialize = require('serialize-javascript');

const resolve = file => path.resolve(__dirname, file);

process.env.VUE_ENV = 'server';

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;

const app = express();

const html = (() => {
  const template = fs.readFileSync(resolve('../index.html'), 'utf-8');
  const appPos = template.indexOf('<!-- inject: APP -->');

  // styles are injected dynamically via vue-style-loader in development
  return {
    head: template.slice(0, appPos).replace('<!-- inject: STYLES -->', ''),
    tail: template.slice(appPos + '<!-- inject: APP -->'.length),
  };
})();

function createRenderer(bundle) {
  return createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
  });
}

// App server renderer
let renderer;
require('./setup-dev-server')(app, bundle => {
  renderer = createRenderer(bundle);
});

app.use('/dist', express.static(resolve('../dist')));
app.use('/assets', express.static(resolve('../src/assets')));
app.use(favicon(resolve('../src/assets/logo.svg')));

function writeResponse(req, res) {
  const startTime = Date.now();
  const context = { url: req.url };
  const renderStream = renderer.renderToStream(context);

  let firstChunk = true;

  res.write(html.head);

  renderStream.on('data', chunk => {
    if (firstChunk) {
      // Embed initial store state
      if (context.initialState) {
        res.write(
          `<script>
            window.__INITIAL_STATE__=${serialize(context.initialState, { isJSON: true })};
            window.__I18N_PHRASES__=${serialize(context.localePhrases, { isJSON: true })};
          </script>`
        );
      }

      // Embed browserSync
      res.write(
        `<script id="__bs_script__">//<![CDATA[
            document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.2.14.0.js'><\\/script>".replace("HOST", location.hostname));
        //]]></script>`
      );

      firstChunk = false;
    }

    res.write(chunk);
  });

  renderStream.on('end', () => {
    res.end(html.tail);
    console.log(`Request rendering time: ${Date.now() - startTime}ms`);
  });

  renderStream.on('error', err => {
    throw err;
  });
}

app.get('*', (req, res) => {
  if (!renderer) {
    const rendererCheck = setInterval(() => {
      if (renderer) {
        clearInterval(rendererCheck);
        writeResponse(req, res);
      }
    }, 200);
  } else {
    writeResponse(req, res);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
