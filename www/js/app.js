

// ik snap dit niet goed; vanuit de service files moeten we naar de 1 keer gedefinieerde module kunnen verwijzen
angular.module('calcworks.services', []);
angular.module('calcworks.controllers', []);

angular.module('calcworks', ['ionic', 'calcworks.services', 'calcworks.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in sheetsCtrl.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.calculator', {
    url: '/calculator',
    views: {
      'tab-calculator': {
        templateUrl: 'templates/tab-calculator.html',
        controller: 'CalculatorCtrl'
      }
    }
  })
  .state('tab.sheets', {
      url: '/sheets',
      views: {
        'tab-sheets': {
          templateUrl: 'templates/tab-sheets.html',
          controller: 'SheetsCtrl'
        }
      }
    })
    .state('tab.sheet-detail', {
      url: '/sheet/:sheetId',
      views: {
        'tab-sheets': {
          templateUrl: 'templates/sheet-detail.html',
          controller: 'SheetDetailCtrl'
        }
      }
    })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/calculator');

});
