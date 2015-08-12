'use strict';


angular.module('calcworks.services')

    .factory('renameCalculationDialog', function($ionicPopup, sheetService, calcService, $rootScope) {

        return {
            showPopup: function (calc, sheet) {
                var $scope = $rootScope.$new();
                $scope.data = {};
                $scope.data.name = calc.varName;

                var renamePopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="data.name"> <br> {{errorMsg}}',
                    title: 'Enter new name for the calculation',
                    subTitle: '(Please use normal characters)',
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
                                if (!isCalcName($scope.data.name)) {
                                    // we houden hier geen rekening met de 'x' - hopelijk kunnen we dit nog fixen
                                    $scope.errorMsg = 'The name must start with a character followed by characters or digits';
                                    e.preventDefault();
                                } else {
                                    return $scope.data.name;
                                }
                            }
                        }
                    ]
                });
                renamePopup.then(function (res) {
                    if (res) {
                        calcService.renameVar(calc, res, sheet);
                        sheetService.saveSheet(sheet);
                    }
                });
            }
        };

});

