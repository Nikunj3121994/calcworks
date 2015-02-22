"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, $ionicActionSheet, $timeout, sheetService) {
        $scope.sheets = sheetService.getSheets();
        $scope.showResolvedExpression = true;

    //$scope.deleteSheet = function(id) {
    //    sheetService.deleteSheet(id);
    //};
    //
    })


    .controller('SheetDetailCtrl', function($scope, $stateParams, sheetService) {
        $scope.showDelete = false;
        $scope.showReorder = false;
        $scope.listCanSwipe = true;
        $scope.showResolvedExpression = true;
        $scope.sheet = sheetService.getSheet($stateParams.sheetId);
    });
