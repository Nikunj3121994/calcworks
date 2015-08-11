"use strict";

angular.module('calcworks.controllers')

.controller('SheetDetailCtrl', function($scope, $rootScope, $state, $log, $stateParams, renameCalculationDialog, sheetService) {
    $scope.showDelete = false;
    $scope.showReorder = false;
    $scope.listCanSwipe = true;
    if ($stateParams.sheetId) {
        sheetService.setActiveSheet($stateParams.sheetId);
        $scope.sheet = sheetService.getSheet($stateParams.sheetId);
        $log.log('SheetDetailCtrl, sheet id:' + $scope.sheet.id);
    } else {
        $scope.sheet = sheetService.getActiveSheet();
    }

    $scope.$on('sheetsUpdated', function(e, value) {
        // we zouden dit kunnen optimaliseren door naar specifieke event 'active-sheet-changed' te kijken
        // maar ik betwijfel of dit veel winst oplevert
        $scope.sheet = sheetService.getActiveSheet();
    });

    $scope.deleteCalculation = function(index) {
        $scope.sheet.deleteCalculation(index, 1);
        sheetService.saveSheets();
    };

    $scope.reorderItem = function(item, fromIndex, toIndex) {
        var array = $scope.sheet.calculations;
        array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
        sheetService.saveSheets();
    };

    $scope.newSheet = function() {
        sheetService.createNewActiveSheet();
        $scope.sheet = sheetService.getActiveSheet();
    };

    $scope.navigateToCalculator = function(calculation) {
        // hack nodig om een nieuwe state te vermijden
        // je zou ook kunnen onderzoeken of je de activeSheet kan bewerken. Dan heb je een netter mvc model
        $rootScope.hackSelectedCalcName = calculation.varName;
        $state.go('tab.calculator');
    };

    $scope.toggleSum = function() {
        console.log(".." + $scope.sheet.hasSum);
        $scope.sheet.hasSum = !$scope.sheet.hasSum;
    };

    $scope.showRenamePopup = function(calc) { renameCalculationDialog.showPopup(calc, $scope.sheet); };


});
