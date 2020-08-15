exports.config = {
  allScriptsTimeout: 1100000,

  specs: [
    'src_ng/**/*.e2e.js',
  ],

  capabilities: {
    'browserName': 'chrome',
  },

  baseUrl: 'http://localhost:1337/',

  framework: 'mocha',

  mochaOpts: {
    reporter: 'spec',
    slow: 3000,
    enableTimeouts: false,

  },

};
