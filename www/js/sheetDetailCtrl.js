"use strict";

angular.module('calcworks.controllers')

.controller('SheetDetailCtrl', function($scope, $rootScope, $state, $ionicActionSheet, $stateParams, $ionicModal, renameDialogs, sheetService, calcService, sheetHtmlService) {

    var state = $stateParams;

    $scope.showDelete = false;
    $scope.showReorder = false;
    $scope.listCanSwipe = true;
    $scope.sheet = sheetService.getActiveSheet();

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

    $scope.showRenamePopup = function(calc) { renameDialogs.showRenameCalculationDialog(calc, $scope.sheet); };


    // with this approach the popup is always initialized on startup
    // we can optimize this by initializing in the show, however in this case we need to wait till
    // the promise in the then() is resolved
    // init $scope.macroModalPopup:
    $ionicModal.fromTemplateUrl('templates/configure-macro.html', {
        scope: null,
        animation: 'slide-in-up'
    }).then(function(modal) {

        var closeModal = function() {
            $scope.macroModalPopup.hide();
        };
        var selectCalculationModalClicked = function(calc) {
            if (calc) {
                if (modal.scope.mode === 'input') {
                    modal.scope.inputCalculation = calc;
                } else {
                    modal.scope.outputCalculation = calc;
                }
                modal.scope.toggleInputOutput();
                if (modal.scope.inputCalculation && modal.scope.outputCalculation) {
                    modal.scope.sheet.inputCalculation = modal.scope.inputCalculation;
                    modal.scope.sheet.outputCalculation = modal.scope.outputCalculation;
                    sheetService.saveSheet(modal.scope.sheet);
                    closeModal();
                }
            } else {
                // cancel
                closeModal();
            }
        }

        $scope.macroModalPopup = modal;
        modal.scope.mode = 'input';
        modal.scope.inputCalculation = undefined;
        modal.scope.outputCalculation = undefined;
        modal.scope.sheet = undefined; // defined in showMacroPopup
        modal.scope.clickCalculation = selectCalculationModalClicked;
        modal.scope.toggleInputOutput = function() {
            if (modal.scope.mode === 'input') {
                modal.scope.mode = 'output';
            } else {
                modal.scope.mode = 'input';
            }
        };

    });

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.macroModalPopup.remove();
    });


    function showConfigMacroPopup() {
        $scope.macroModalPopup.scope.sheet = $scope.sheet;
        $scope.macroModalPopup.show();
    }


    function newSheet() {
        sheetService.createNewActiveSheet();
        $scope.sheet = sheetService.getActiveSheet();
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
                    showConfigMacroPopup();
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
