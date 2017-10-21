const webpackConfig = require('./webpack.config');
const helpers = require('./helpers');

webpackConfig.entry.main = helpers.root('/src/main.ts');

module.exports = webpackConfig;
