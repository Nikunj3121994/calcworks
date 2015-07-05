"use strict";

angular.module('calcworks.controllers')

.controller('CalculatorCtrl', function($scope, $rootScope, $stateParams, $log, $ionicPopup, $ionicModal, calcService, sheetService) {

    //consider: ipv sheetService zou je ook via de resolve: in app.js de activeSheet kunnen injecteren.
    // op deze manier heb je een betere decoupling

    var decimalSeparator = getDecimalSeparator();
    var lastVarName = '';
    var selectedCalc;

    $scope.reset = function() {
        $scope.display = '0';   // must be a string, cannot be a number, for example because of 0.00
        $scope.operatorStr = '';
        $scope.expression = []; // array of calcNames, operators as char and numbers
        $scope.result = null;
        // misschien kan $scope wel weg
        $scope.numberEnteringState = false;  // na de eerste digit zit je in deze state totdat een operator, bracket of equals komt
        $scope.expressionEnteringState = false;   // geeft aan dat een nieuwe expression is gestart  (direct na equals is deze false)
        $scope.plusMinusTyped = false; // flag to remember if plusMinus was typed while still 0 in display
    };

    // use this function as a reset when bracket open or closed is entered
    var miniReset = function() {
        $scope.display = '0';
        $scope.numberEnteringState = false;
        $scope.plusMinusTyped = false;
        $scope.operatorStr = '';

    };

    function init() {
        $log.log('calculatorCtrl: init');
        $scope.sheet = sheetService.getActiveSheet();
        // we should not use varName, but last number, would be a lot easier. Perhaps store this number in Sheet
        $log.log('calculatorCtrl: calculationName empty');
        lastVarName = 'calc' + $scope.sheet.getLastNumberFromCalcName();
        selectedCalc = null;
        $scope.reset();
    }

    // test utility method to reset the var names
    $scope._test_reset = function() {
        $scope.sheet.calculations = [];
        lastVarName = '';
        selectedCalc = null;
        $scope.reset();
    };

    // de activeSheet tab kan een calculatie selecteren en geeft dit door via een globale variabele
    // deze hack was nodig omdat anders via een state.go() een nieuwe state geintroduceerd werd
    // echter deze oplossing is ook fout omdat je een verandering nodig hebt, en dat is er niet per se t geval
    // nu dwingen we deze af via een gore hack
    $rootScope.$watch('hackSelectedCalcName', function(newVal, oldVal) {
        $log.log('calculatorCtrl: calculationName= ' + newVal);
        if (!newVal) {
            $log.log('calculatorCtrl: null');
            return false;
        }
        // todo: we moeten er rekening mee houden dat de geselecteerde calc wel eens een andere sheet kan zijn
        var calc = sheetService.getActiveSheet().getCalculationFor(newVal);
        $scope.processSelectedCalculation(calc);
        $rootScope.hackSelectedCalcName = null; // dit triggered weer een watch....
    }, true);

    // de calculator controller heeft altijd een active sheet nodig om zijn rekenwerk in te doen
    // (de filter gaat variabelen resolven)
    // evt in de toekomst  $scope.$on('$ionicView.beforeEnter', function() {
    init();  // misschien moet deze naar app.js als ie device ready is

    // nu kan sheetsUpdated zich alleen voordoen door deleteAllSheets
    $scope.$on('sheetsUpdated', function(e, value) {
        init();
    });


    // hier een scope functie van gemaakt om te kunnen testen
    $scope.processSelectedCalculation = function (calc) {
        selectedCalc = calc;
        $scope.display = calc.result;
        $scope.operatorStr = '';
        $scope.numberEnteringState = false;  // er is niet een getal ingetikt
        // wis de expressie als we nu een nieuwe gaan beginnen met een variabele
        if (!$scope.expressionEnteringState) {
            expressionEnteringStart();
            //$scope.expression = [];
            // consider: expressionEnteringState = true,  je bent nu een expressie aan t invoeren
            // deze logica zit ook in UpdateDisplayExpression - misschien dat t handiger kan door deze aan te roepen..
            // merk op dat bij een nieuw getal we de expression niet wissen, inconsequent....
        }
    };

    var selectCalculationModalClicked = function(calc) {
        if (calc) {
            // not cancel clicked
            $log.log('selected calc= ' + calc.varName + ' (' + calc.result +')');
            $scope.processSelectedCalculation(calc);
        }
        $scope.closeModal();
    };

    // als we nog ooit met een eigen controller willen werken voor deze popup,
    // zie dan http://www.dwmkerr.com/the-only-angularjs-modal-service-youll-ever-need/
    $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
        scope: null,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectCalculationModal = modal;
        modal.scope.sheet = sheetService.getActiveSheet();  // of $scope.sheet
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
        if ($scope.numberEnteringState === false) {
            $scope.display = '' + n;
            $scope.numberEnteringState = true;
            if ($scope.plusMinusTyped) {
                $scope.plusMinusTyped = false;
                $scope.operatorStr = '';
                addMinusSymbolToDisplay();
            }
        } else {
            if ($scope.display === '0') {
                $scope.display = '' + n;
            } else {
                $scope.display = ($scope.display) + n;
            }
        }
    };


    $scope.touchDecimalSeparator = function() {
        $scope.numberEnteringState = true; // needed if someone starts with period char
        // make sure you can only add decimal separator once
        if ($scope.display.indexOf(decimalSeparator) < 0) {
            $scope.display = ($scope.display) + decimalSeparator;
        } // consider: else show/give error signal - however not sure if we can do this in every error situation
    };

    $scope.touchDelete = function() {
        //todo:  if $scope.numberEnteringState && operatorStr then operatorStr = null    so you can overwrite operator
        if ($scope.display.length===1) {
            $scope.display = '0';
            $scope.numberEnteringState = false;
        } else {
            $scope.display = $scope.display.substring(0, $scope.display.length - 1);
            $scope.numberEnteringState = true;
        }
    };

    $scope.touchRecall = function() {
        $scope.openModal();
    };

    $scope.touchRemember = function() {
        $scope.data = {};

        var renamePopup = $ionicPopup.prompt({
            title: 'Enter a name for this calculation',
            template: 'Give this calculation a name so you can easily recall it later.',
            inputPlaceholder: 'new name',
            autofocus: true
        });
        renamePopup.then(function(newName) {
            if (newName) {
                calcService.renameVar(selectedCalc, newName, $scope.sheet);
                sheetService.saveSheets();
            }
        });
    };

    $scope.touchPlusMinOperator = function() {
        if ($scope.numberEnteringState === false) {
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
        // 2)  variable
        // 3)  ... (d * d)
        // 4)  0   but there is a previous answer
        if ($scope.numberEnteringState || selectedCalc || $scope.expression[$scope.expression.length-1]=== ')' || (!$scope.expressionEnteringState && $scope.sheet.nrOfCalcs() > 0)) {
            updateDisplayAndExpression();
            $scope.expression.push(operator);
            $scope.operatorStr = operator;
            $scope.numberEnteringState = false;
        } else {
            console.log('touchOperator error condition');
            // ignore because this is a binary operator, so an operand must have been entered
            // consider: error signal
        }
    };

    $scope.touchOpenBracket = function() {
        // we do not change $scope.operatorStr to bracket open, bracket is not an operator.
        // also expression already shows the bracket
        if (!$scope.expressionEnteringState) {
            miniReset();
            $scope.expressionEnteringState = true;
        }
        $scope.expression.push('(');
    };


    // detect whether an operand has been entered: a number or expression closed with bracket
    function operandEntered() {
        return $scope.numberEnteringState === true || $scope.operatorStr === '';
    }

    $scope.touchCloseBracket = function() {
        var countOpenBrackets = countOccurencesInExpression('(', $scope.expression);
        var countCloseBrackets = countOccurencesInExpression(')', $scope.expression);
        if (countOpenBrackets - countCloseBrackets >= 1  && operandEntered()) {
            updateDisplayAndExpression();
            $scope.expression.push(')');
            // we closed an intermediate expression, now we start 'fresh', sort of mini reset
            miniReset();
        } else {
            // todo: error signal
        }
    };

    function expressionEnteringStart() {
        $scope.expressionEnteringState = true;
        $scope.expression = [];
        $scope.result = null;
    };

    // na elke 'actie' moet expression en display bijgewerkt worden
    // operator, close bracket, equalsOperator  call this function
    // deze functie is brittle, er is een volgorde afhankelijkheid die niet goed is
    // het probleem is dat we niet goed weten wat er gebeurt is en indirect dit bepalen / veronderstellen
    // Misschien dat we de vlag/state expressionEnteringState kunnen gebruiken om dit beter te maken
    function updateDisplayAndExpression() {
        if (!$scope.expressionEnteringState) {
            expressionEnteringStart();
        }
        // if a number is added to the display then we should add it to the expression
        if ($scope.numberEnteringState === true) {
            $scope.expression.push(+$scope.display);
            $scope.display = '0';
            selectedCalc = null;
        } else if (selectedCalc) {
            // er is niet een getal ingetikt, maar er is wel een variabele gekozen
            $scope.expression.push(selectedCalc.varName);
            $scope.display = '0';
            selectedCalc = null;
        } // else
            // er is geen getal ingetikt maar er staat al wel wat in de expression
            // we hoeven dan niets te doen.
            // (close bracket can trigger this path)
    }

    // we could move this function to Sheet
    function createNewCalculation(expression) {
        $log.log('info calculatorCtrl:createNewCalculation: lastVarName: ' + lastVarName);
        var varName = generateCalcName(lastVarName);
        lastVarName = varName;
        var id = generateUUID();
        var calc = new Calculation(id, varName, expression);
        return calc;
    }


    // in tegenstelling tot andere 'touches' bestaat de equals uit 2 zaken:
    // verwerkerking van de input tot aan de '=' en daarna het resultaat uitrekenen/tonen
    $scope.touchEqualsOperator = function() {
        if (operandEntered()) {
            updateDisplayAndExpression();
            try {
                // nu moeten we nog het resultaat verwerken:
                $scope.operatorStr = '';
                var calc = createNewCalculation($scope.expression);
                $scope.sheet.add(calc);
                calcService.calculate($scope.sheet);
                if (!isFinite(calc.result)) $log.log("warning: wrong result for " + calc.expression);
                $scope.result = calc.result;                 // type is number
                $scope.display = $rootScope.convertNumberToDisplay(calc.result);     // type is string
                sheetService.saveSheets();
                selectedCalc = calc;  // by default is de selectedCalc de laatste uitkomst
            } catch (e) {
                if (e instanceof SyntaxError) {
                    $scope.display = 'error';
                } else {
                    $log.error('internal error: ' + e);
                    $scope.display = 'internal error: ' + e;
                }
            }
            $scope.numberEnteringState = false;
            $scope.expressionEnteringState = false;
        } else {
            // ignore, consider error signal
        }
    };


})
// filter that expects a number (not a string!) and converts it to a string with the right decimals
.filter('toFixedDecimals', function($log, $rootScope) {
        return function (input) {
            if (input === undefined || input === null) {
                return null;
            } else {
                return $rootScope.convertNumberToDisplay(input);
            }
        };
});
