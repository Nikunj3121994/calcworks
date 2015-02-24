"use strict";

angular.module('calcworks.controllers')

.controller('CalculatorCtrl', function($scope, calcService, sheetService) {

    var decimalSeparator = getDecimalSeparator();
    var lastVarName = '';


    $scope.reset = function() {
        $scope.display = '0';   // must be a string, cannot be a number, for example because of 0.00
        $scope.operatorStr = '';
        $scope.expression = '';
        // misschien kan $scope wel weg
        $scope.newNumber = true;
        $scope.newExpression = true;   // indicates that a complete new, empty expression is started  (so occurs after reset or after equals)
        $scope.plusMinusTyped = false; // flag to remember if plusMinus was typed while still 0 in display
        //$scope.invalidCalcVarName = null;
        //$scope.invalidExpression = null;   // perhaps rename to invalidCalcExpression
        //$scope.calculationError = null; // this is the error message for global errors like circular reference
    };

    // use this function as a reset when bracket open or closed is entered
    var miniReset = function() {
        $scope.display = '0';
        $scope.newNumber = true;
        $scope.plusMinusTyped = false;
        $scope.operatorStr = '';

    };

    $scope.newSheet = function() {
        $scope.reset();
        lastVarName = '';
        sheetService.newSheet();
    };

        // de calculator controller heeft altijd een sheet nodig om zijn rekenwerk in te doen
        // (de filter gaat variabelen resolven)
    $scope.newSheet();  // misschien moet deze naar app.js als ie device ready is

    //$scope.$on('sheetsUpdated', function(e, value) {
    //    // consider: eigenlijk zou je alleen een nieuwe sheet moeten aanmaken als het nodig is
    //    $scope.newSheet();
    //);


    $scope.touchDigit = function(n) {
        if ($scope.newNumber === true) {
            if (n === 0 && $scope.display === '0') {
                // ignore
            } else {
                $scope.display = '' + n;
                $scope.newNumber = false;
                if ($scope.plusMinusTyped) {
                    $scope.plusMinusTyped = false;
                    $scope.operatorStr = '';
                    addMinusSymbolToDisplay();
                }
            }
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

    // binary operator
    $scope.touchOperator = function(operator) {
        // we should detect if an intermediate expression has been entered, situations:
        // 1)  d
        // 2)  ... (d * d)
        // 3)  0   but there is a previous answer
        if (!$scope.newNumber || endsWith($scope.expression, ')') || ($scope.newExpression && sheetService.getCurrentSheet().nrOfCalcs() > 0)) {
            updateDisplayAndExpression();
            $scope.expression = addSpaceIfNeeded($scope.expression) + operator;
            $scope.operatorStr = operator;
            $scope.newNumber = true;
        } else {
            // ignore because this is a binary operator, so an operand must have been entered
            // consider: error signal
        }
    };

    $scope.touchOpenBracket = function() {
        // we do not change $scope.operatorStr to bracket open, bracket is not an operator.
        // also expression already shows the bracket
        if ($scope.newExpression) {
            miniReset();
            $scope.expression = '(';
            $scope.newExpression = false;
        } else {
            $scope.expression = addSpaceIfNeeded($scope.expression) + '(';
        }
    };


    // detect whether an operand has been entered: a number or expression closed with bracket
    function operandEntered() {
        return $scope.newNumber === false || $scope.operatorStr === '';
    }

    $scope.touchCloseBracket = function() {
        var countOpenBrackets = ($scope.expression.match(/\(/g) || []).length;
        var countCloseBrackets = ($scope.expression.match(/\)/g) || []).length;
        if (countOpenBrackets - countCloseBrackets >= 1  && operandEntered()) {
            updateDisplayAndExpression();
            $scope.expression = $scope.expression + ')';
            // we closed an intermediate expression, now we start 'fresh', sort of mini reset
            miniReset();
        } else {
            // todo: error signal
        }
    };

    // operator, close bracket, equalsOperator  call this function
    function updateDisplayAndExpression() {
        if ($scope.newExpression) {
            $scope.newExpression = false;
            $scope.expression = '';
        }
        // only if display contains something we should add it to the expression
        if ($scope.newNumber === false) {
            $scope.expression = addSpaceIfNeeded($scope.expression) + $scope.display;
            $scope.display = '0';
        } else if ($scope.expression.trim()) {
            // do nothing (close bracket can trigger this path)
        } else {
            $scope.display = '0';
            $scope.expression = lastVarName; // previous result identifier, so you get eventually something like 'calc1 + ... '
        }
    }

    function createNewCalculation(expression) {
        var varName = generateVarName(lastVarName);
        lastVarName = varName;
        var id = ionic.Utils.nextUid(); // ionic util
        var calc = new Calculation(id, varName, expression);
        return calc;
    }


    $scope.touchEqualsOperator = function() {
        if (operandEntered()) {
            updateDisplayAndExpression();
            try {
                $scope.operatorStr = '';
                var calc = createNewCalculation($scope.expression);
                sheetService.getCurrentSheet().add(calc);
                calcService.calculate(sheetService.getCurrentSheet().calculations);
                $scope.display = calc.result.toString();
                $scope.expression = calc.resolvedExpression + ' = ' + $scope.display;
                sheetService.saveSheets();
            } catch (e) {
                if (e instanceof SyntaxError) {
                    $scope.display = 'error';
                } else {
                    console.log('internal error: ' + e);
                    $scope.display = 'internal error: ' + e;
                }
            }
            $scope.newNumber = true;
            $scope.newExpression = true;
        } else {
            // ignore, consider error signal
        }
    };


})
    //todo: write test for this filter
.filter('resolve', function(calcService, sheetService) {
    return function(input) {
        // als input een variabele naam bevat dan deze vervangen door de uitkomst = vorige calculation
        // we doen dit met een hack voor nu.
        var tempCalc = new Calculation('', '', input);
        var varnames = tempCalc.parseVarsExpression();
        if (varnames.length > 1) {
            return "internal error, varnames length larger than 1: " + varnames; // kan wel. maar hoe?
        } else if (varnames.length === 1) {
            // replace var with value
            var calcs = sheetService.getCurrentSheet().calculations;
            var value = calcs[calcs.length-1].result;
            var result = calcService.replaceAllVars(varnames[0], value, input);
            return result;
        } else {
            return input;
        }
    };
});
