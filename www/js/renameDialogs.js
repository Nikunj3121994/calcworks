'use strict';


angular.module('calcworks.services')

    .factory('renameDialogs', function($ionicPopup, sheetService, calcService, $rootScope) {

        var $scope = $rootScope.$new();
        var renamePopupData = {
            templateUrl: 'templates/renameDialog.html',
            title: '',  // defined below
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.name) {
                            e.preventDefault();
                            $scope.errorMsg = 'The name cannot be empty';
                        }
                        if (!isValidObjectName($scope.data.name)) {
                            $scope.errorMsg = 'The name must start with a character followed by characters or digits';
                            e.preventDefault();
                        } else {
                            return $scope.data.name;
                        }
                    }
                }
            ]
        };
        var renameSheetPopupData =  renamePopupData;
        renameSheetPopupData.title = 'Name for the sheet';
        var renameCalculationPopupData =  renamePopupData;
        renameCalculationPopupData.title = 'Name for the calculation';
        $scope.reset = function() {
            $scope.data.name = '';
            //consider: set focus to the input field
        };

        return {
            showRenameCalculationDialog: function(calc, sheet) {
                $scope.data = {};
                $scope.data.name = calc.varName;
                var renamePopup = $ionicPopup.show(renameCalculationPopupData);
                renamePopup.then(function (res) {
                    if (res) {
                        calc.varName = res;
                        sheetService.saveSheet(sheet);
                    }
                });
            },
            showRenameSheetDialog: function(sheet) {
                $scope.data = {};
                $scope.data.name = sheet.name;
                var renamePopup = $ionicPopup.show(renameSheetPopupData);
                renamePopup.then(function (res) {
                    if (res) {
                        sheet.name = res;
                        sheetService.saveSheet(sheet);
                    }
                });
            }
        };

});

