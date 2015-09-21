"use strict";

angular.module('calcworks.controllers')

.controller('SheetDetailCtrl', function($scope, $rootScope, $state, $ionicActionSheet, $stateParams, $ionicModal,
                                        renameDialogs, configureMacroDialog, sheetService, calcService, sheetHtmlService) {

    var state = $stateParams;

    $scope.showDelete = false;
    $scope.showReorder = false;
    $scope.listCanSwipe = true;
    $scope.sheet = sheetService.getActiveSheet();
    $scope.showCalcCreatedTime = false;

    $scope.$on('$ionicView.beforeEnter', function (e) {
        if (state.sheetId) {
            sheetService.setActiveSheet($stateParams.sheetId);
            $scope.sheet = sheetService.getSheet($stateParams.sheetId);
        }
    });

    $scope.$on('sheetsUpdated', function(e, value) {
        // we zouden dit kunnen optimaliseren door naar specifieke event 'active-sheet-changed' te kijken
        // maar ik betwijfel of dit veel winst oplevert
        $scope.sheet = sheetService.getActiveSheet();
    });

    $scope.renameSheet = function() {
        renameDialogs.showRenameSheetDialog($scope.sheet);
    };

    $scope.deleteCalculation = function(index) {
        $scope.sheet.deleteCalculation(index, 1);
        sheetService.saveSheet($scope.sheet);
    };

    // drop item
    $scope.reorderItem = function(item, fromIndex, toIndex) {
        var array = $scope.sheet.calculations;
        array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
        sheetService.saveSheet($scope.sheet);
    };

    $scope.navigateToCalculator = function(calculation) {
        // hack nodig om een nieuwe state te vermijden
        // je zou ook kunnen onderzoeken of je de activeSheet kan bewerken. Dan heb je een netter mvc model
        $rootScope.hackSelectedCalcName = calculation.name;
        $state.go('tab.calculator');
    };

    $scope.toggleSum = function() {
        $scope.sheet.hasSum = !$scope.sheet.hasSum;
    };

    $scope.showRenamePopup = function(calc) {
        renameDialogs.showRenameCalculationDialog(calc, $scope.sheet);
    };


    // with this approach the popup is always initialized on startup
    // we can optimize this by initializing in the show, however in this case we need to wait till
    // the promise in the then() is resolved
    // init $scope.macroModalPopup:


    function newSheet() {
        sheetService.createNewActiveSheet();
        $scope.sheet = sheetService.getActiveSheet();
        $state.go('tab.calculator');
    }


    $scope.showActionSheet = function() {

        var btns = [
            { text: 'New' },
            { text: 'Share' }
        ];
        // based on conditions we add more menu buttons, the order is important!
        if ($scope.sheet.calculations.length > 1) {
            btns.push({text: 'Macro'});
            if ($scope.sheet.inputCalculation && $scope.sheet.outputCalculation) {
                btns.push({text: 'Run'});
            }
        }
        $ionicActionSheet.show({
            buttons: btns,
            //destructiveText: 'Delete Sheet',
            //titleText: 'Modify your album',
            cancelText: 'Cancel',
            cancel: function() {
                // nothing to do
            },
            buttonClicked: function(index) {
                if (index===0) {
                    newSheet();
                }
                if (index===1) {
                    sheetHtmlService.emailSheet($scope.sheet);
                }
                if (index===2) {
                    configureMacroDialog.showConfigureMacroDialog($scope.sheet);
                }
                if (index===3) {
                    $state.get('tab.calculator').data.mode = 'run';
                    $state.go('tab.calculator');
                }

                return true; // close the sheet
            }
            //todo destructiveButtonClicked
        });
    };

});
