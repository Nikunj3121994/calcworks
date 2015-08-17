// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    // If basePath is a relative path, it will be resolved to the __dirname of the configuration file.
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browse
    // pas later vond ik uit dat ionic.bundle.js ook angular libs heeft, deze js zou misschien al alleen voldoende
    // dus een keer proberen:  'www/lib/ionic/js/ionic.js'  ->  'www/lib/ionic/js/ionic.bundle.js',
    // en de angular libs verwijderen  - niet alleen dependency maar ook inclusief de files
    files: [
      'www/lib/angular/angular.js',
      'www/lib/angular-animate/angular-animate.js',
      'www/lib/angular-ui-router/release/angular-ui-router.js',
      'www/lib/angular-sanitize/angular-sanitize.js',
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

    reportSlowerThan: 50,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // consider: PhantomJS
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
