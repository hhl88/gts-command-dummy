/* eslint-disable */
var fs = require('fs');

var config = {local: false};

// parse eventual local test configs
try {
  config = JSON.parse(fs.readFileSync('../gts-config/local.json').toString());
} catch (e) {
  console.log('No such file');
}

module.exports = {
  domain: 'https://control-staging-develop.green-technology-solutions.de',

  // poll for changes in the configs
  githubPolling: 6 * 10000,
  configRepo: 'git@github.com:gts-software/gts-config.git',
  clonePath: '/tmp/anlagen-config',

  // portChecking
  checkInterval: 600000,
  username: 'pi',
  host: '0.0.0.0',

  remotePiPort: '11559',

  targetDb: process.env.MONGO_URL || 'mongodb://localhost/gts-webservice',

};
