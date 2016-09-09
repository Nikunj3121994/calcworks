exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

  specs: ['calculator-e2e-spec.js'],

  onPrepare: function() {
    browser.driver.manage().window().setSize(400, 800);
  },

  jasmineNodeOpts: {
    showColors: true
  },


  capabilities: {
      'browserName': 'chrome',
      'loggingPrefs': {
          'browser': 'ALL'
      }
  },

};
