"use strict";

angular.module('calcworks.controllers')

.controller('SheetDetailCtrl', function($scope, $rootScope, $state, $ionicActionSheet, $stateParams, $ionicModal, $ionicPopover,
                                        renameDialogs, configureMacroDialog, sheetService, calcService, sheetHtmlService) {

    var state = $stateParams;

    $scope.showDelete = false;
    $scope.showReorder = false;
    $scope.listCanSwipe = true;
    $scope.sheet = sheetService.getActiveSheet();
    //$scope.sheetDisplayOption = 'n'; // ext (extended), expr (expression), (cond) condensed


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

    $scope.navigateToCalculator = function(calc) {
        $state.get('tab.calculator').data.mode = 'use';
        $state.get('tab.calculator').data.calc = calc;
        $state.go('tab.calculator');
    };

    $scope.toggleSum = function() {
        $scope.sheet.displayOptions.showSum = !$scope.sheet.displayOptions.showSum;
        sheetService.saveSheet($scope.sheet);  //TODO: do savesheet on exit of view instead of each change
    };

    $scope.toggleShowGraphBar = function() {
        $scope.sheet.displayOptions.showGraphBar = !$scope.sheet.displayOptions.showGraphBar;
        sheetService.saveSheet($scope.sheet);
    };

    $scope.toggleDecimals = function() {
        if ($scope.sheet.numberDisplayOption.minimumFractionDigits === 2) {
            $scope.sheet.numberDisplayOption.minimumFractionDigits = null;
        } else {
            $scope.sheet.numberDisplayOption.minimumFractionDigits = 2;
        }
        sheetService.saveSheet($scope.sheet);
    };

    //TODO: deze popups op onshow aanmaken zodat opstarten applicatie niet trager gaat

    // with this approach the popup is always initialized on startup
    // we can optimize this by initializing in the show, however in this case we need to wait till
    // the promise in the then() is resolved
    // init $scope.macroModalPopup:


    // this popup code is based on http://codepen.io/vladius/pen/VLEOQo
    $ionicPopover.fromTemplateUrl('templates/calc-menu-popup.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.calcMenuPopover = popover;
    });

    // this popup code is based on http://codepen.io/vladius/pen/VLEOQo
    $ionicPopover.fromTemplateUrl('templates/sheet-display-options-popup.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.sheetDisplayOptionsPopover = popover;
    });


    $scope.openSheetDisplayOptionsPopover = function($event) {
        $scope.sheetDisplayOptionsPopover.show($event);
    };

    // called from the popup html
    $scope.setSheetDisplayOption = function(option) {
        $scope.sheet.displayOptions.style = option;
    };

    $scope.closeSheetDisplayOptionsPopover= function() {
        $scope.sheetDisplayOptionsPopover.hide();
    };

    $scope.openCalcMenuPopover = function($event, calc) {
        $scope.calcMenuPopover.show($event);
        $scope.calcMenuPopover.calc = calc;
    };

    $scope.closeCalcMenuPopover = function() {
        $scope.calcMenuPopover.hide();
    };

      //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function()  {
        $scope.calcMenuPopover.remove();
        $scope.sheetDisplayOptionsPopover.remove();
    });


    $scope.editCalc = function() {
        $scope.closeCalcMenuPopover();
        $state.get('tab.calculator').data.mode = 'edit';
        $state.get('tab.calculator').data.calc = $scope.calcMenuPopover.calc;
        $state.go('tab.calculator');
    };

    $scope.showCalcRenamePopup = function() {
        $scope.closeCalcMenuPopover();
        renameDialogs.showRenameCalculationDialog($scope.calcMenuPopover.calc, $scope.sheet);
    };


    function newSheet() {
        sheetService.createNewActiveSheet();
        $scope.sheet = sheetService.getActiveSheet();
        $state.go('tab.calculator');
    }


    $scope.showActionSheet = function() {

        var btns = [
            { text: 'New' },
            { text: 'Rename' },
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
            cancelText: 'Cancel',
            cancel: function() {
                // nothing to do
            },
            buttonClicked: function(index) {
                if (index===0) {
                    newSheet();
                }
                else if (index===1) {
                    $scope.renameSheet();
                }
                else if (index===2) {
                    sheetHtmlService.emailSheet($scope.sheet);
                }
                else if (index===3) {
                    configureMacroDialog.showConfigureMacroDialog($scope.sheet);
                }
                else if (index===4) {
                    $state.get('tab.calculator').data.mode = 'run';
                    $state.go('tab.calculator');
                }

                return true; // close the sheet
            }
            // we could implement destructiveButtonClicked - delete sheet
        });
    };

});
