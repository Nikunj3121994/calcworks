
angular.module('calcworks.controllers')

.controller('CalculatorCtrl', function($scope, calcService, sheetService) {

    var decimalSeparator = getDecimalSeparator();
    var lastVarName = '';  // ik weet niet of deze in reboot gereset wordt of zou moeten worden


    $scope.reset = function() {
        $scope.display = '0';   // must be a string, cannot be a number, for example because of 0.00
        $scope.operatorStr = '';
        $scope.expression = '';
        // misschien kan $scope wel weg
        $scope.newNumber = true;
        $scope.newExpression = true;
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
        updateDisplayAndExpression();
        $scope.expression = addSpaceIfNeeded($scope.expression) + operator;
        $scope.operatorStr = operator;
        $scope.newNumber = true;
    };

    $scope.touchOpenBracket = function() {
        $scope.operatorStr = '(';
        $scope.expression = addSpaceIfNeeded($scope.expression) + '(';
        $scope.newExpression = false;
    };

    $scope.touchCloseBracket = function() {
        // todo: dit is alleen toegestaan als een getal ingetikt was - anders een error geven en ignoren
        updateDisplayAndExpression();
        $scope.expression = $scope.expression + ')';
        // we closed an intermediate expression, now we start 'fresh', sort of mini reset
        $scope.display = '0';
        $scope.newNumber = true;
        $scope.plusMinusTyped = false;
        $scope.operatorStr = '';
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
        //var id = calcService.generateUUID();
        var calc = new Calculation(1234, varName, expression);
        return calc;
    }


    $scope.touchEqualsOperator = function() {
        updateDisplayAndExpression();
        try {
            $scope.operatorStr = '';
            var calc = createNewCalculation($scope.expression);
            sheetService.currentSheet().push(calc);
            calcService.calculate(sheetService.currentSheet());
            $scope.display = calc.result.toString();
        } catch (e) {
            if (e instanceof SyntaxError) {
                $scope.display = 'error';
            }
        }
        $scope.expression = calc.resolvedExpression + ' = ' + $scope.display;
        $scope.newNumber = true;
        $scope.newExpression = true;
    };


})
.filter('resolve', function(calcService, sheetService) {
    return function(input) {
        // als input een variabele naam bevat dan deze vervangen door de uitkomst = vorige calculation
        // we doen dit met een hack voor nu.
        var tempCalc = new Calculation('', '', input);
        var varnames = tempCalc.parseVarsExpression();
        if (varnames.length > 1) {
            return "internal error, varnames length larger than 1"; // kan wel. maar hoe?
        } else if (varnames.length === 1) {
            // replace var with value
            var calcs = sheetService.currentSheet();
            var value = calcs[calcs.length-1].result;
            var result = calcService.replaceAllVars(varnames[0], value, input);
            return result;
        } else {
            return input;
        }
    };
});
