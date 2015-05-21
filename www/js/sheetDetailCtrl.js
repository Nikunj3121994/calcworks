"use strict";

angular.module('calcworks.controllers')

    .controller('SheetDetailCtrl', function($scope, $rootScope, $state, $log, $stateParams, $ionicPopup, sheetService, calcService) {
        $scope.showDelete = false;
        $scope.showReorder = false;
        $scope.listCanSwipe = true;
        $scope.showResolvedExpression = true;
        // dit kan je ook via resolve: kunnen doen
        // zie http://learn.ionicframework.com/formulas/sharing-data-between-views/
        if ($stateParams.sheetId) {
            $scope.sheet = sheetService.getSheet($stateParams.sheetId);
            $log.log('SheetDetailCtrl, sheet id:' + $scope.sheet.id);
        } else {
            $scope.sheet = sheetService.getActiveSheet();
        }

        //$scope.$on('sheetsUpdated', function(e, value) {
        //    $scope.sheet = sheetService.getSheet($stateParams.sheetId);
        //});

        // ipv bij elke change te saven, zouden we dit ook bij de view exit kunnen doen

        $scope.deleteCalculation = function(index) {
            $scope.sheet.calculations.splice(index, 1);
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
            // het zit me niet helemaal lekker dat we een 'nieuwe state' introduceren. Deze navigatie zou ook
            // stateless kunnen zijn - vermoed ik
            $rootScope.hackSelectedCalc = calculation.varName;
            //$state.go('tab.calculator', { calculationName: calculation.varName});
            $state.go('tab.calculator');
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
