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
                            $scope.errorMsg = 'The name must start with a character followed by max 19 characters or digits';
                            e.preventDefault();
                        } else {
                            return $scope.data.name;
                        }
                    }
                }
            ]
        };
        $scope.reset = function() {
            $scope.data = {};
            $scope.data.name = '';
            $scope.errorMsg = '';
            //consider: set focus to the input field
        };

        return {
            showRenameCalculationDialog: function(calc, sheet) {
                renamePopupData.title = 'Name this calculation';
                $scope.reset();
                if (!calc.name.startsWith('calc')) {
                    $scope.data.name = calc.name;
                }
                var renamePopup = $ionicPopup.show(renamePopupData);
                renamePopup.then(function (res) {
                    if (res) {
                        calc.name = res;
                        sheetService.saveSheet(sheet); // mmm, misschien is het beter om de caller de save te laten doen
                    }
                });
            },
            showRenameSheetDialog: function(sheet) {
                renamePopupData.title = 'Name this sheet';
                $scope.reset();
                if (!sheet.name === sheet.defaultName) {
                    $scope.data.name = sheet.name;
                }
                var renamePopup = $ionicPopup.show(renamePopupData);
                renamePopup.then(function (res) {
                    if (res) {
                        sheet.name = res;
                        // mmm, misschien is het beter om de caller de save te laten doen, maar dat is door de promise nog niet zo makkelijk
                        sheetService.saveSheet(sheet);
                    }
                });
            },
            // this function is for a very special use-case when a sheet is marked as favorite and needs a name
            showRenameFavoriteSheetDialog: function(sheet) {
                renamePopupData.title = 'A favorite sheet must have a name:';
                $scope.reset();
                var renamePopup = $ionicPopup.show(renamePopupData);
                renamePopup.then(function (res) {
                    if (res) {
                        sheet.favorite = true;
                        sheet.name = res;
                        sheetService.saveSheet(sheet);
                    }
                });
            }
        };

});

