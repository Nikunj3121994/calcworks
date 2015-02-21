"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, $ionicActionSheet, $timeout, sheetService) {
        $scope.sheets = sheetService.getSheets();
        $scope.showResolvedExpression = true;

        console.log('>>>' + $scope.sheets.length);

        // is allemaal naar detail sheet gegaan
        //$scope.activeSheetId = null;
    //    $scope.changeResolvedExpression = function() {
    //    // verwijderen denk ik
    //    };
    //
    //    $scope.showActionSheet = function(id) {
    //
    //        $scope.activeSheetId = id;
    //
    //    };
    //
    //$scope.deleteSheet = function(id) {
    //    sheetService.deleteSheet(id);
    //};
    //
    })


    .controller('SheetDetailCtrl', function($scope, $stateParams, sheetService) {
        $scope.showResolvedExpression = true;
        $scope.sheet = sheetService.getSheet($stateParams.sheetId);
    });
