
angular.module('calcworks.controllers')

.controller('CalculatorCtrl', function($scope, calcService) {

    var decimalSeparator = getDecimalSeparator();
    var lastVarName = '';  // ik weet niet of deze in reboot gereset wordt of zou moeten worden
    $scope.calculations = [];  // array of Calculation      idem

    $scope.reset = function() {
        $scope.display = '0';   // must be a string, cannot be a number, for example because of 0.00
        $scope.operatorStr = '';
        $scope.expression = '';
        // misschien kan $scope wel weg
        $scope.newNumber = true;
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


    $scope.touchDecimalSeparator = function() {
        $scope.newNumber = false; // needed if someone starts with period char
        // make sure you can only add decimal separator once
        if ($scope.display.indexOf(decimalSeparator) < 0) {
            $scope.display = ($scope.display) + decimalSeparator;
        } // consider: else show/give error signal - however not sure if we can do this in every error situation
    };

    $scope.touchDelete = function() {
        if ($scope.display.length===1) {
            $scope.display = '0';
            $scope.newNumber = true;
        } else {
            $scope.display = $scope.display.substring(0, $scope.display.length - 1);
        }
    };

    $scope.touchPlusMinOperator = function() {
        if ($scope.newNumber === true) {
            if ($scope.plusMinusTyped) {
                $scope.plusMinusTyped = false;
                $scope.operatorStr = '';
            } else {
                $scope.operatorStr = '-';
                $scope.plusMinusTyped = true;
            }
        } else {
            // determine if this is already a minus symbol - if so then remove it
            if ($scope.display.lastIndexOf('-', 0) === 0) {
                $scope.display = $scope.display.substring(1);
            } else {
                addMinusSymbolToDisplay();
            }
        }
    };

    function addMinusSymbolToDisplay() {
        $scope.display = '-' + $scope.display;
    }

    $scope.touchOperator = function(operator) {
        $scope.expression = appendDisplayToExpression();
        $scope.expression = addSpaceIfNeeded($scope.expression) + operator;
        $scope.operatorStr = operator;
        $scope.newNumber = true;
    };

    $scope.touchOpenBracket = function() {
        $scope.operatorStr = '(';
        $scope.expression = addSpaceIfNeeded($scope.expression) + '(';
    };

    $scope.touchCloseBracket = function() {
        // todo: dit is alleen toegestaan als nu een getal ingetikt wordt - anders een error geven en ignoren
        $scope.expression = appendDisplayToExpression();
        $scope.expression = $scope.expression + ')';
        // we closed an intermediate expression, now we start 'fresh', sort of mini reset
        $scope.display = '0';
        $scope.newNumber = true;
        $scope.plusMinusTyped = false;
        $scope.operatorStr = '';
    };

    // operator, close bracket, isOperator  call this function
    function appendDisplayToExpression() {
        // only if display contains something we should add it to the expression
        if ($scope.newNumber === false) {
            var result = addSpaceIfNeeded($scope.expression) + $scope.display;
            $scope.display = '0';
            return result;
        } else if ($scope.expression.trim()) {
            return $scope.expression;
        } else {
            $scope.display = '0';
            return lastVarName; // previous result identifier, so you get eventually something like 'calc1 + ... '
        }
    }

    function createNewCalculation(expression) {
        var varName = generateVarName(lastVarName);
        lastVarName = varName;
        //var id = calcService.generateUUID();
        var calc = new Calculation(1234, varName, expression);
        return calc;
    }


    $scope.touchEqualsOperator = function() {
        $scope.expression = appendDisplayToExpression();
        try {
            $scope.operatorStr = '';
            var calc = createNewCalculation($scope.expression);
            $scope.calculations.push(calc);
            calcService.calculate($scope.calculations);
            $scope.display = calc.result.toString();
        } catch (e) {
            if (e instanceof SyntaxError) {
                $scope.display = 'error';
            }
        }
        $scope.expression = '';  // dit moet een uitgestelde operatie worden
        $scope.newNumber = true;
    };


});
