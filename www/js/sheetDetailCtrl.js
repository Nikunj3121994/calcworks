"use strict";

angular.module('calcworks.controllers')

    .controller('SheetDetailCtrl', function($scope, $stateParams, sheetService) {
        $scope.showDelete = false;
        $scope.showReorder = false;
        $scope.listCanSwipe = true;
        $scope.showResolvedExpression = true;
        $scope.sheet = sheetService.getSheet($stateParams.sheetId);
    });
