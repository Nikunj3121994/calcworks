"use strict";

angular.module('calcworks.controllers')

.controller('CalculatorCtrl', function($scope, $log, $ionicPopup, $ionicModal, calcService, sheetService) {

    //consider: ipv sheetService zou je ook via de resolve: in app.js de activeSheet kunnen injecteren.
    // op deze manier heb je een betere decoupling

    var decimalSeparator = getDecimalSeparator();
    var lastVarName = '';
    var sheet;
    var lastCalc;


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

    function init() {
        $scope.reset();
        sheet = sheetService.getActiveSheet();
        // we should not use varName, but last number, would be a lot easier. Perhaps store this in Sheet
        // je kan nu ook lastCalc gebruiken...
        lastVarName = 'calc' + sheet.getLastNumberFromVarName();
        lastCalc = null;
    }

    // de calculator controller heeft altijd een active sheet nodig om zijn rekenwerk in te doen
    // (de filter gaat variabelen resolven)
    // evt in de toekomst  $scope.$on('$ionicView.beforeEnter', function() {
    init();  // misschien moet deze naar app.js als ie device ready is

    // nu kan sheetsUpdated zich alleen voordoen door deleteAllSheets
    $scope.$on('sheetsUpdated', function(e, value) {
        init();
    });

    var selectCalculationModalClicked = function(calc) {
        if (calc) {
            // not cancel clicked
            $log.log('selected calc: ' + calc.varName + ' (' + calc.result +')');
            lastCalc = calc;
            $scope.display = calc.result;
            $scope.operatorStr = '';
            $scope.newNumber = false;
        }
        $scope.closeModal();
    };

    // als we nog ooit met een eigen controller willen werken: http://www.dwmkerr.com/the-only-angularjs-modal-service-youll-ever-need/
    $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
        scope: null,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectCalculationModal = modal;
        modal.scope.sheet = sheet;
        modal.scope.clickCalculation = selectCalculationModalClicked;
    });
    $scope.openModal = function() {
        $scope.selectCalculationModal.show();
    };
    $scope.closeModal = function() {
        $scope.selectCalculationModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.selectCalculationModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

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
        //todo:  if $scope.newNumber && operatorStr then operatorStr = null    so you can overwrite operator
        if ($scope.display.length===1) {
            $scope.display = '0';
            $scope.newNumber = true;
        } else {
            $scope.display = $scope.display.substring(0, $scope.display.length - 1);
            $scope.newNumber = false;
        }
    };

    $scope.touchRecall = function() {
        $scope.openModal();
    };

    $scope.touchRemember = function() {
        $scope.data = {};

        var renamePopup = $ionicPopup.prompt({
            title: 'Enter a name for the calculation',
            template: 'Give this calculation a name so you can easily recall it later.',
            inputPlaceholder: 'new name'
        });
        renamePopup.then(function(newName) {
            if (newName) {
                calcService.renameVar(lastCalc, newName, sheet);
                sheetService.saveSheets();
            }
        });
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
        if (!$scope.newNumber || endsWith($scope.expression, ')') || ($scope.newExpression && sheet.nrOfCalcs() > 0)) {
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
            $scope.expression = lastCalc.varName; //lastVarName; // previous result identifier, so you get eventually something like 'calc1 + ... '
        }
    }

    // we could move this function to Sheet
    function createNewCalculation(expression) {
        $log.log('info: lastVarName: ' + lastVarName);
        var varName = generateVarName(lastVarName);
        lastVarName = varName;
        var id = ionic.Utils.nextUid(); // ionic util
        var calc = new Calculation(id, varName, expression);
        return calc;
    }


    $scope.touchEqualsOperator = function() {
        if (operandEntered()) {
            updateDisplayAndExpression(); // toch een beetje raar als we hieronder de display en expression bijwerken
            try {
                $scope.operatorStr = '';
                var calc = createNewCalculation($scope.expression);
                sheet.add(calc);
                calcService.calculate(sheet.calculations);
                if (calc.result === null) $log.warning("warning: null result for " + calc.expression);
                $scope.display = calc.result.toString();
                $scope.expression = calc.resolvedExpression + ' = ' + $scope.display;
                sheetService.saveSheets();
                lastCalc = calc;
            } catch (e) {
                if (e instanceof SyntaxError) {
                    $scope.display = 'error';
                } else {
                    $log.error('internal error: ' + e);
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
// filter that resolves the varnames into values in the latest calculation from the active sheet
.filter('resolve', function($log, calcService, sheetService) {
    return function(input) {
        // als input een variabele naam bevat dan deze vervangen door de uitkomst = vorige calculation
        // we doen dit met een hack voor nu.
        var tempCalc = new Calculation('', '', input);
        var varnames = tempCalc.parseVarsExpression();
        $log.log("resolve filter; varname: " + varnames);
        if (varnames.length > 1) {
            return "internal error, varnames length larger than 1: " + varnames; // kan wel. maar hoe?
        } else if (varnames.length === 1) {
            var value = sheetService.getActiveSheet().getValueFor(varnames[0]);
            var result = calcService.replaceAllVars(varnames[0], value, input);
            return result;
        } else {
            return input;
        }
    };
});
