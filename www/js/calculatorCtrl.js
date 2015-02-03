
angular.module('calcworks.controllers')

.controller('CalculatorCtrl', function($scope) {


    $scope.reset = function() {
        $scope.display = '0';   // must be a string, cannot be a number, for example because of 0.00
        $scope.operatorStr = '';
        $scope.newNumber = true;
        $scope.expression = '';
        $scope.plusMinusTyped = false; // flag to remember if plusMinus was typed while still 0 in display
        //$scope.invalidCalcVarName = null;
        //$scope.invalidExpression = null;   // perhaps rename to invalidCalcExpression
        //$scope.calculationError = null; // this is the error message for global errors like circular reference
    };

    $scope.reset();


    $scope.touchDigit = function(n) {
        if ($scope.newNumber === true) {
            if (n !==0) {
                $scope.display = '' + n;
                $scope.newNumber = false;
                if ($scope.plusMinusTyped) {
                    $scope.plusMinusTyped = false;
                    $scope.operatorStr = '';
                    addMinusSymbolToDisplay();
                }
            } // else ignore
        } else {
            $scope.display = ($scope.display) + n;
        }
    };

});
