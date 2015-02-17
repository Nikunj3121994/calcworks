"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, sheetService) {
        //$scope.sheet = sheetService.getCurrentSheet();
        $scope.sheets = sheetService.getSheets();
        $scope.showResolvedExpression = true;

        $scope.changeResolvedExpression = function() {

        };
    })

    .controller('SheetDetailCtrl', function($scope, $stateParams, Sheets) {
      //$scope.sheet = Sheets.get($stateParams.sheetId);
    });
