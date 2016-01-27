"use strict";

angular.module('calcworks.controllers')


// Deze controller moet eigenlijk twee dingen doen:
// de display(s) bijwerken
//  en
// de expressie opbouwen
.controller('CalculatorCtrl', function($scope, $rootScope, $state, $stateParams, $log, $ionicModal, $ionicPopup, $timeout, calcService, sheetService, renameDialogs) {


    var decimalSeparator = getDigitSeparators().decimalSeparator;
    var lastVarName = '';
    var selectedCalc;  // een geselecteerde calc - via recall of een ander tabblad of de vorige uitkomst
    var state = $stateParams;  // dit moeten we in app.js in de rootscope stoppen

    var resetDataMode = function() {
        $state.get('tab.calculator').data.mode = 'normal';
    }

    // use this function as a reset when bracket open or closed is entered
    var miniReset = function() {
        $scope.display = '0';
        $scope.numberEnteringState = false;
        $scope.plusMinusTyped = false;
        $scope.operatorStr = '';

    };

    $scope.reset = function() {
        miniReset();
        $scope.expression = [];     // array of Calculations, operators as string and numbers
        $scope.result = null;       // we check for null so do not make this undefined

        $scope.expressionEnteringState = false;   // geeft aan dat een nieuwe expression is gestart  (direct na equals is deze false)
        $scope.macroMode = false;   // an enum for the modes would be nicer
        $scope.editMode = false;
        $scope.editCalc = undefined; // the calc that is edited
        resetDataMode();
        /* if you want to play around with some preset data:
            $scope.expression = [2, '+', 3];
            $scope.result = 5;
        */
    };

    function init() {
        //console.log('init');
        $scope.sheet = sheetService.getActiveSheet();
        // we should not use varName, but last number, would be a lot easier. Perhaps store this number in Sheet
        // 'calc' is used in renameDialog, so keep them in sync. Consider using Angular's constant service.
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


    $scope.$on('$ionicView.beforeEnter', function () {
        //console.log('beforeEnter calcCtrl  state.mode: ' + $state.current.data.mode);
        if ($state.current.data.mode === 'run') {
            $scope.reset();  // whipe out left overs
            $scope.macroMode = true;
            // consider: display the inputCalculation.result as a placeholder somehow to make first edit easier
        } else if ($state.current.data.mode === 'edit') {
            $scope.reset();  // whipe out left overs
            $scope.editMode = true;
            $scope.editCalc = $state.current.data.calc;
        } else if ($state.current.data.mode === 'use') {
            resetDataMode();  // we do not call reset() since we want to keep intermediate expression
            $scope.processSelectedCalculation($state.current.data.calc);
        }
    });

    // de calculator controller heeft altijd een active sheet nodig om zijn rekenwerk in te doen
    // (de filter gaat variabelen resolven)
    // evt in de toekomst  $scope.$on('$ionicView.beforeEnter', function() {
    init();  // misschien moet deze naar app.js als ie device ready is

    // nu kan sheetsUpdated zich  voordoen door deleteAllSheets en change van activeSheet
    $scope.$on('sheetsUpdated', function(e, value) {
        //console.log('sheetsUpdated: ' + value);
        init();
    });

    $scope.cancelMacroMode = function() {
        $scope.reset();
    };

    $scope.cancelEditMode = function() {
        $scope.reset();
    };

    // hier een scope functie van gemaakt om te kunnen testen
    $scope.processSelectedCalculation = function(calc) {
        selectedCalc = calc;  // onthoud welke calc is gekozen zodat we deze later kunnen gebruiken bij t bouwen vd expression
        var number = calc.result
        if ($scope.plusMinusTyped) {
            number = -number;
        }
        $scope.display = $rootScope.convertNumberToDisplay(number);
        $scope.operatorStr = '';
        $scope.numberEnteringState = false;  // er is niet een getal ingetikt
        // make sure we start the expression (cause of the built-in delay)
        if (!$scope.expressionEnteringState) {
            expressionEnteringStart();
        }
    };

    var selectCalculationModalClicked = function(calc) {
        if (calc) {
            if ($scope.editCalc !== calc) {
                // OK clicked
                $scope.processSelectedCalculation(calc);
                $scope.closeModal();
            }
        } else {
            // cancel clicked
            $scope.closeModal();
        }
    };

    // als we nog ooit met een eigen controller willen werken voor deze popup,
    // zie http://stackoverflow.com/questions/27434262/pass-a-controller-to-ionicmodal
    $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
        scope: null,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.selectCalculationModal = modal;
        modal.scope.sheet = undefined; // wait till openModal
        modal.scope.notAllowedCalc = undefined; // wait till openModal
        modal.scope.clickCalculation = selectCalculationModalClicked;
    });

    $scope.openModal = function() {
        $scope.selectCalculationModal.scope.sheet = sheetService.getActiveSheet();
        if ($scope.editMode === true) {
            // we cannot allow the calc that is being edited to pick itself
            $scope.selectCalculationModal.scope.notAllowedCalc = $scope.editCalc;
        }
        $scope.selectCalculationModal.show();
    };

    $scope.closeModal = function() {
        $scope.selectCalculationModal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.selectCalculationModal.remove();
    });


    $scope.touchDigit = function(n) {
        // merk op dat bij een nieuw getal we de expression niet wissen, inconsequent maar wel handig dat je
        // nog het resultaat van de vorige keer ziet
        // eigenlijk zouden we dit moeten doen:
        // expressionEnteringStart();
        // nu doen we dit pas bij de eerste operator
        if ($scope.numberEnteringState === false) {
            // de eerste keer dat een digit wordt ingetikt
            $scope.display = '' + n;
            $scope.numberEnteringState = true;
            if ($scope.plusMinusTyped) {
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
        if (!containsDecimalPart($scope.display)) {
            $scope.display = ($scope.display) + decimalSeparator;
        } // consider: else show/give error signal - however not sure if we can do this in every error situation
    };

    // de delete is tegelijkertijd ook een undo-operator
    // het zou misschien beter zijn geweest om deze te implementeren door de states op een stack te zetten
    // de state zou dan een object zijn met alle state properties
    $scope.touchDelete = function() {
        var length = $scope.expression.length;
        if (length > 0 && $scope.expression[length-1]==='(') {
            // laatste exprItem was een haakje open
            $scope.expression.splice(length - 1, 1);
            if (length > 1 && $scope.expression[length-2] === '_') {
                $scope.operatorStr = '-';
                $scope.plusMinusTyped = true;
            }
            $scope.numberEnteringState = true;
        } else if (length > 0 && $scope.expression[length-1]==='_') {
            // laatste exprItem was plusMin
            $scope.expression.splice(length - 1, 1);
            if (length > 1) {
                $scope.operatorStr = $scope.expression[length-2];
            } else {
                $scope.operatorStr = '';
            }
            $scope.plusMinusTyped = false;
        } else if (
                  (!$scope.numberEnteringState && $scope.operatorStr) ||
                  ($scope.expression[length-1]===')') )
           {
            // laatste exprItem was een operator of haakje sluiten
            // note: als alleen een operator is ingetikt dan staat er een 0 voor
            // de lengte is altijd groter dan 2 maar just-to-be-sure
            if (length >= 2) {
                $scope.operatorStr = '';
                var exprItem = $scope.expression[length - 2];
                if (exprItem instanceof Calculation) {
                    selectedCalc = exprItem;
                    $scope.display = $rootScope.convertNumberToDisplay(exprItem.result);
                    $scope.numberEnteringState = false;
                } else {
                    $scope.display = exprItem.toString();
                    $scope.numberEnteringState = true;
                }
                // verwijder de operand en de operator/haakje
                $scope.expression.splice(length - 2, 2);
            }
        } else if (($scope.display.length===1) || ($scope.display.substring(0,1)==='-' && $scope.display.length===2))   {
            // getal bestaande uit 1 cijfer ingetikt met evt het plusmin symbool
            // toch is dit niet helemaal correct; we halen ook meteen het plusmin symbool weg, bij openhaakje doen we dit niet
            $scope.display = '0';
            $scope.numberEnteringState = false;
            if (length > 0) {
                $scope.operatorStr = $scope.expression[length-1];
            }
        } else {
            // getal bestaande uit meerdere cijfers ingetikt
            $scope.display = $scope.display.substring(0, $scope.display.length - 1);
            $scope.numberEnteringState = true;
        }
    };

    $scope.touchRecall = function() {
        $scope.openModal();
    };

        //todo: de parameter wordt niet gebruikt....
    $scope.touchRemember = function(calc) {
        renameDialogs.showRenameCalculationDialog(selectedCalc, $scope.sheet);
    };

    $scope.touchPlusMinOperator = function() {
        if ($scope.numberEnteringState === false  && selectedCalc === null) {
            if ($scope.plusMinusTyped) {
                $scope.operatorStr = '';
            } else {
                $scope.operatorStr = '-';
            }
        } else {
            // determine if there is already a minus symbol - if so then remove it
            if ($scope.display.lastIndexOf('-', 0) === 0) {
                $scope.display = $scope.display.substring(1);
            } else {
                addMinusSymbolToDisplay();
            }
        }
        $scope.plusMinusTyped = !$scope.plusMinusTyped;
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
        } else {
            // er was al een operator ingetikt, de (nieuwe) operator overschrijft de bestaande
            $scope.expression[$scope.expression.length-1] = operator;
        }
        $scope.operatorStr = operator;
        $scope.numberEnteringState = false;
        $scope.plusMinusTyped = false;
    };

    $scope.touchOpenBracket = function() {
        if ($scope.plusMinusTyped) {
            $scope.expression.push('_');
        }
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
    }

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
        if ($scope.plusMinusTyped) {
            $scope.expression.push('_'); // unaire min operator toevoegen
        }
        if ($scope.numberEnteringState === true) {
            // dit is een hack, doordat we display zowel als buffer als voor display doeleinden gebruiken moeten we het minteken
            // dat we voor display doeleinden hebben toegevoegd er weer afhalen
            $scope.expression.push(Math.abs(+$scope.display));
            $scope.display = '0';
            selectedCalc = null;
        } else if (selectedCalc) {
            // er is niet een getal ingetikt, maar er is wel een calculatie gekozen
            $scope.expression.push(selectedCalc);
            $scope.display = '0';
            selectedCalc = null;
        } // else
            // er is geen getal ingetikt maar er staat al wel wat in de expression
            // we hoeven dan niets te doen.
            // (close bracket can trigger this path)
    }

    // we could move this function to Sheet
    function createNewCalculation() {
        var name = generateCalcName(lastVarName);
        lastVarName = name;
        var id = generateUUID();
        var calc = new Calculation(id, name, []);
        return calc;
    }


    // in tegenstelling tot andere 'touches' bestaat de equals uit 2 zaken:
    // verwerkerking van de input tot aan de '=' en daarna het resultaat uitrekenen/tonen
    $scope.touchEqualsOperator = function() {
        if ($scope.macroMode) {
            $scope.equalsOperatorMacroMode();
        } else if ($scope.editMode) {
            $scope.equalsOperatorEditMode();
        } else {
            $scope.equalsOperatorNormalMode();
        }
    };

    $scope.equalsOperatorMacroMode = function() {
        $scope.sheet.inputCalculation.expression = [ +$scope.display ];
        calcService.calculate($scope.sheet);
        $scope.numberEnteringState = false;
        $scope.expressionEnteringState = false;
    };

    $scope.equalsOperatorEditMode = function() {
        $scope.processCalc($scope.editCalc);
        $scope.editMode = false;
    };

    $scope.equalsOperatorNormalMode = function() {
        // als twee keer achter elkaar = wordt ingedrukt dan is dit een short cut voor de remember functie
        // doordat een nieuw getal niet meteen expressionEnteringStart() aanroept kan result en display out of sync zijn
        // we eisen dat ze wel hetzelfde zijn voor de remember functie
        if ($scope.result && $rootScope.convertNumberToDisplayWithoutThousandsSeparator($scope.result) === $scope.display) {
            this.touchRemember();
        } else {
            var calc = createNewCalculation(); // consider to use editCalc instead and create this instance in reset()
            $scope.sheet.add(calc);
            if (!$scope.processCalc(calc)) {
                // the calculation gave an error so let's remove the calc
                $scope.sheet.deleteCalculation(0);
            };
        }
    };

    // returns whether the calculation was valid
    $scope.processCalc = function(calc) {
        var result = true;
        if (!operandEntered()) {
            $scope.expression.push(0); // voeg getal 0 toe zodat de expressie altijd een operand heeft na de operator
        }
        updateDisplayAndExpression();
        calc.expression = $scope.expression;
        try {
            calcService.calculate($scope.sheet);
            if (calc.result === null) throw new Error('Invalid calculation');   // e.g. cycle in calculations
            if (!isFinite(calc.result)) throw new Error('Invalid calculation'); // e.g. divide by zero
            $scope.result = calc.result;                 // type is number
            $scope.display = $rootScope.convertNumberToDisplayWithoutThousandsSeparator(calc.result);     // type is string
            sheetService.saveSheet($scope.sheet);
            selectedCalc = calc;  // by default is de selectedCalc de laatste uitkomst
        } catch (e) {
            //console.log('error exception: ' + e);
            result = false;
            // the initial idea was to implement a kind of undo, but the last action is not necessarily
            // the one that triggers the error, e.g. 2 + cycle-calc + 3
            // so we fall back to a complete reset. If we would have a proper editor we could keep the expression
            // and let the user fix the expression. We could introduce an insert vs edit mode.
            miniReset();
            $scope.expression = [];
            $scope.result = null;
            calc.expression = [];
            calc.result = null;
            var msg = e.message;
            var alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: msg
                });
             alertPopup.then(function(res) {  });
             $timeout(function() {
                  alertPopup.close();
               }, 3000);
         }
         $scope.operatorStr = '';
         $scope.numberEnteringState = false;
         $scope.expressionEnteringState = false;
         $scope.plusMinusTyped = false;
         return result;
    };


});
