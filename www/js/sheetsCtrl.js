"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, $ionicActionSheet, $timeout, sheetService) {
        //$scope.sheet = sheetService.getCurrentSheet();
        $scope.sheets = sheetService.getSheets();
        $scope.showResolvedExpression = true;
        $scope.activeSheetId = null;

        $scope.changeResolvedExpression = function() {
        // verwijderen denk ik
        };

        $scope.showActionSheet = function(id) {

            $scope.activeSheetId = id;

        };

    $scope.deleteSheet = function(id) {
        sheetService.deleteSheet(id);
    };

    })


    .controller('SheetDetailCtrl', function($scope, $stateParams, Sheets) {
      //$scope.sheet = Sheets.get($stateParams.sheetId);
    });
