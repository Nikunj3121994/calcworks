"use strict";

angular.module('calcworks.controllers')

    .controller('SheetDetailCtrl', function($scope, $stateParams, $ionicPopup, sheetService, calcService) {
        $scope.showDelete = false;
        $scope.showReorder = false;
        $scope.listCanSwipe = true;
        $scope.showResolvedExpression = true;
        $scope.sheet = sheetService.getSheet($stateParams.sheetId);

        //$scope.$on('sheetsUpdated', function(e, value) {
        //    $scope.sheet = sheetService.getSheet($stateParams.sheetId);
        //});


        $scope.deleteCalculation = function(index) {
            $scope.sheet.calculations.splice(index, 1);
            sheetService.saveSheets();
        };


        $scope.showRenamePopup = function(calc) {
            $scope.data = {};

            var renamePopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.name">',
                title: 'Enter new name for the variable',
                subTitle: '(Please use normal characters)',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.name) {
                                //don't allow the user to close unless he enters something
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
