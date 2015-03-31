"use strict";

angular.module('calcworks.controllers')

    .controller('SelectCalculationCtrl', function($scope, $log, $state, sheetService) {
        $scope.showResolvedExpression = true;
        $scope.sheet = sheetService.getActiveSheet();

    $scope.clickCalculation = function(calc) {
        $log.log("selected: " + calc.varName);
        $state.go('tab.calculator', {calculationName: calc.varName});
    };

});
