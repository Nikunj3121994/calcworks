exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: ['calculator-e2e-spec.js'],

  onPrepare: function() {
    browser.driver.manage().window().setSize(400, 800);
  },

  jasmineNodeOpts: {
    showColors: true
  }
};
