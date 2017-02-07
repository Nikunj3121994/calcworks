"use strict";

// ik snap dit niet goed; vanuit de service files moeten we naar de 1 keer gedefinieerde module kunnen verwijzen
angular.module('calcworks.services', []);
angular.module('calcworks.controllers', []);

angular.module('calcworks', ['ionic', 'calcworks.services', 'calcworks.controllers','ngAnimate' ])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {

    $rootScope.nrOfDecimals = 2;

    // we need to add these functions as global functions for the directives
    $rootScope.convertNumberForRendering = function(number) {
        return convertNumberForRendering(number, $rootScope.nrOfDecimals);
    };

    $rootScope.getExprItemForRendering = function(exprItem, displayCalculationName) {
        return getExprItemForRendering(exprItem, $rootScope.nrOfDecimals, displayCalculationName);
    };

    $rootScope.showWaitingIcon = function() {
        $ionicLoading.show({
          template: 'Please wait...'
        }).then(function(){
           //console.log("The loading indicator is now displayed");
        });
    };

    $rootScope.hideWaitingIcon = function(){
        $ionicLoading.hide().then(function(){
           //console.log("The loading indicator is now hidden");
        });
    };

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
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })


      // todo: use the using the controllerAs syntax
      // controllerAs: 'contact'
      // https://github.com/angular-ui/ui-router/wiki#onenter-and-onexit-callbacks

  // Each tab has its own nav history stack:

  .state('tab.calculator', {
    url: '/calculator',
          data: {
              mode: 'normal'
          },
    views: {
      'tab-calculator': {
        templateUrl: 'templates/tab-calculator.html',
        controller: 'CalculatorCtrl'
      }
    }
  })
  .state('tab.active-sheet', {
      url: '/activesheet',
      params: { sheetId: null },
      views: {
          'tab-active-sheet': {
              templateUrl: 'templates/sheet-detail.html',
              controller: 'SheetDetailCtrl'
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
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  .state('tab.feedback', {
    url: '/feedback',
    views: {
      'tab-feedback': {
        templateUrl: 'templates/tab-feedback.html',
        controller: 'FeedbackCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/calculator');

});
