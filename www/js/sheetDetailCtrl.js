"use strict";

angular.module('calcworks.controllers')

.controller('SheetDetailCtrl', function($scope, $rootScope, $state, $log, $stateParams, $ionicPopup, sheetService, calcService) {
    $scope.showDelete = false;
    $scope.showReorder = false;
    $scope.listCanSwipe = true;
    $scope.showResolvedExpression = true;
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

    $scope.showRenamePopup = function(calc) {
        $scope.data = {};
        $scope.data.name = calc.varName;

        var renamePopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.name">',
            title: 'Enter new name for the calculation',
            subTitle: '(Please use normal characters)',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.name) {
                            //don't allow the user to close unless he enters something
                            e.preventDefault();
                        } if ($scope.data.name === 'x') {
                            // do not allow 'x' because of multiply
                            // todo: show error message
                            e.preventDefault();
                        } else {
                            return $scope.data.name;
                        }
                    }
                }
            ]
        });
        renamePopup.then(function(res) {
            if (res) {
                calcService.renameVar(calc, res, $scope.sheet);
                sheetService.saveSheets();
            }
        });
    };


});
