// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    // If basePath is a relative path, it will be resolved to the __dirname of the configuration file.
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'www/lib/angular/angular.js',
      'www/lib/angular-animate/angular-animate.js',
      //'www/lib/angular-cookies/angular-cookies.js',
      //'www/lib/angular-resource/angular-resource.js',
      'www/lib/angular-sanitize/angular-sanitize.js',
      //'www/lib/angular-route/angular-route.js',
      //'www/lib/angular-touch/angular-touch.js',
      'www/lib/angular-mocks/angular-mocks.js',
      'www/lib/ionic/js/ionic.js',
      'www/lib/ionic/js/ionic-angular.js',
      'www/js/*.js',
      'www/js/**/*.js',
        // die test files staan ook al in de gulp file...
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
