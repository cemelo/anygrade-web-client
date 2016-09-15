var merge = require('webpack-merge');
var productionEnv = require('./production');

module.exports = merge(productionEnv, {
  NODE_ENV: '"testing"'
});
