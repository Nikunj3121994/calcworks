"use strict";

angular.module('calcworks.controllers')


// Deze controller moet eigenlijk twee dingen doen:
// de display(s) bijwerken
//  en
// de expressie opbouwen

// the order is:
//
//   display   ->           expression         ->        calc
//             operator                        equals
//             bracket


//   start  ; lege sheet, lege display, geen vorige calculatie
//   expressionEnteringStart ; lege display, wel vorige calculatie
//   clear -> start or waiting

.controller('CalculatorCtrl', function($scope, $rootScope, $state, $stateParams, $log, $ionicModal, $ionicPopup, $timeout, $animate,
    calcService, sheetService, conversionService, renameDialogs, selectFunctionDialog, selectCalculationDialog) {

    var selectedCalc;  // een geselecteerde calc - via recall of een ander tabblad.
    var state = $stateParams;  // dit moeten we in app.js in de rootscope stoppen
    // actions are for the calculation, commands for the sheet to avoid confusion between the two
    var calcActionHistory;   // history of actions for current calculations, needed for undo of an expression, first is most recent
    var sheetCommandHistory = [];   // history of commans in the context of current sheet; clear, delete, recall, etc

    var resetDataMode = function() {
        $state.get('tab.calculator').data.mode = 'normal';
    }


    function init() {
        $scope.sheet = sheetService.getActiveSheet();
        $scope.reset();
        sheetCommandHistory = [];
    }


    // use this function as a reset when bracket closed is entered or equals
    var miniReset = function() {
        // display acts as the input buffer and is thus a string. It
        // it uses the period as decimal separator.
        // only when *displayed* by a directive it is rendered localised
        // display can have many decimals, the expression panel is limited to 2
        // we zouden display moeten hernoemen tot inputDisplay
        // de expression als outputDisplay of expressionDisplay
        $scope.display = '0';
        $scope.numberEnteringState = false;
        $scope.plusMinusTyped = false;  // note: een negatief getal kan ook een uitkomst zijn, niet noodzakelijk plusmin
        $scope.operatorStr = '';
        selectedCalc = null;            // de geselecteerde calc die bij pas bij operator of equals verwerkt wordt
    };


    function startNewCalculation() {
        $scope.currentCalc = $scope.sheet.createNewCalculation();
    }


    // dit komt overeen met de 'start' mode, initieel of na een clear, stop macro, stop edit
    $scope.reset = function() {
        if (sheetCommandHistory.length > 0 && sheetCommandHistory[0].id === 'reset') {
            sheetCommandHistory = [];
            sheetService.createNewActiveSheet();
            // this will trigger init() through event broadcast
        } else {
            addCommandToSheetHistory('reset');
            miniReset();
            startNewCalculation();
            $scope.macroMode = false;   // an enum for the modes would be nicer
            $scope.editMode = false;
            $scope.editCalcBackup = null;
            calcActionHistory = [];
            resetDataMode();
        }
    };


    // test utility method to also reset the sheet
    $scope._test_reset = function() {
        $scope.sheet.calculations = [];
        selectedCalc = null;
        $scope.reset();
    };

    function addActionToCalcHistory(actionId) {
        var action = { id: actionId,
            display: $scope.display,
            operatorStr : $scope.operatorStr,
            plusMinusTyped: $scope.plusMinusTyped,
            expression: $scope.currentCalc.expression.slice(0),
            numberEnteringState: $scope.numberEnteringState };
        calcActionHistory.splice(0, 0, action);
    };

    function addCommandToSheetHistory(actionId) {
        var action = { id: actionId };
        sheetCommandHistory.splice(0, 0, action);
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        if ($state.current.data.mode === 'run') {
            $scope.reset();  // whipe out left overs
            $scope.macroMode = true;
            // consider: display the inputCalculation.result as a placeholder somehow to make first edit easier
        } else if ($state.current.data.mode === 'edit') {
            $scope.gotoEditMode($state.current.data.calc);
        } else if ($state.current.data.mode === 'use') {
            resetDataMode();  // we do not call reset() since we want to keep intermediate expression
            $scope.processSelectedCalculation($state.current.data.calc);
        }
    });

    // private
    $scope.gotoEditMode = function(calc) {
        addCommandToSheetHistory('edit');
        $scope.reset();  // whipe out left overs
        $scope.editMode = true;
        // maak een backup vd expression zodat je deze kan tonen in de calculator en voor de cancel
        $scope.editCalcBackup = calc.copy();
        $scope.currentCalc = calc;
        $scope.currentCalc.expression = [];
        $scope.currentCalc.result = null;
    }

    // de calculator controller heeft altijd een active sheet nodig om zijn rekenwerk in te doen
    // (de filter gaat variabelen resolven)
    // evt in de toekomst  $scope.$on('$ionicView.beforeEnter', function() {
    init();  // misschien moet deze naar app.js als ie device ready is

    // nu kan sheetsUpdated zich  voordoen door deleteAllSheets en change van activeSheet
    $scope.$on('sheetsUpdated', function(e, value) {
        init();
    });

    $scope.cancelMacroMode = function() {
        addCommandToSheetHistory('cancelMacro');
        $scope.reset();
    };

    $scope.cancelEditMode = function() {
        if (!$scope.editMode) throw "internal error, not in edit mode";
        addCommandToSheetHistory('cancelEdit');
        $scope.currentCalc.expression = $scope.editCalcBackup.expression;
        $scope.currentCalc.result = $scope.editCalcBackup.result;
        $scope.reset();
    };


    // private, but needed for testing
    $scope.showErrorShake = function() {
        var element = angular.element( document.querySelector( '#calculatorId' ) );
        $animate.addClass(element, 'shake').then(
            function() {
                $animate.removeClass(element, 'shake');
            });
    };


    function showAlertPopup(msg) {
       var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: msg
            });
         alertPopup.then(function(res) {  });
         $timeout(function() {
              alertPopup.close();
           }, 3000);
    }


    $scope.touchRecall = function() {
        addCommandToSheetHistory('recall');
        // notAllowedCalc is een beetje simpele benadering om een cycle (maar alleen eerste graads) te vermijden
        // dit nog nader onderzoeken nu editCalc is weggevallen
        var notAllowedCalc = $scope.editMode === true ?  $scope.currentCalcalc : null;
        selectCalculationDialog.showSelectCalculationDialog($scope.sheet, notAllowedCalc, $scope.processSelectedCalculation);
    };

    $scope.touchRemember = function() {
        addCommandToSheetHistory('remember');
        renameDialogs.showRenameCalculationDialog($scope.sheet.getMostRecentCalculation(), $scope.sheet);
    };

    $scope.getCalculationToDisplay = function() {
        var calc = $scope.currentCalc;
        if ($scope.currentCalc.expression.length===0 && !$scope.numberEnteringState) {
            var temp = $scope.sheet.getMostRecentCalculation();
            if (temp) calc = temp;
        }
        return calc;
    }

    // detect whether an operand has been entered: a number or expression
    function operandEntered() {
       if ($scope.currentCalc.expression[$scope.currentCalc.expression.length-1] === ')') return true;
       else if (selectedCalc) return true;
       else return $scope.numberEnteringState === true;
    }


    // copies the content from the display or selected calc to expression
    function updateCurrentCalcExpression() {
        if (selectedCalc) {
            if ($scope.plusMinusTyped) {
                $scope.currentCalc.expression.push('_');
            }
            if (selectedCalc.result < 0) {
                // we moeten de haakjes doen anders krijg je twee min tekens achter elkaar
                $scope.currentCalc.expression.push('(');
                $scope.currentCalc.expression.push(selectedCalc);
                $scope.currentCalc.expression.push(')');
            }
            else {
                $scope.currentCalc.expression.push(selectedCalc);
            }
        }
        // als de operator meteen wordt ingetikt na een vorige berekening, dan nemen we die berekening als input
        // de clear operatie onderbreekt dit, vandaar de test op display  (== test op start mode)
        // note: testen op display 0 is tricky, het kan ook een toevallig resultaat zijn....
        else if (!operandEntered() && $scope.display!='0' && $scope.sheet.getMostRecentCalculation()) {
            var mostRecentCalc = $scope.sheet.getMostRecentCalculation();
            // pas de vorige calculatie toe
            if ($scope.plusMinusTyped) {
                $scope.currentCalc.expression.push('_');
                if (mostRecentCalc.result < 0) {
                    $scope.currentCalc.expression.push('(');
                    $scope.currentCalc.expression.push(mostRecentCalc);
                    $scope.currentCalc.expression.push(')');
                } else {
                    $scope.currentCalc.expression.push(mostRecentCalc);
                }
            } else {
                $scope.currentCalc.expression.push(mostRecentCalc);
            }
        }
        else if (!operandEntered()) {
            $scope.currentCalc.expression.push(0); // voeg getal 0 toe zodat de expressie altijd een operand heeft na de operator
        }
        else {
            // if a number is added to the display then we should add it to the expression
            if ($scope.plusMinusTyped) {
                $scope.currentCalc.expression.push('_'); // unaire min operator toevoegen
            }
            if ($scope.numberEnteringState === true) {
                // dit is een hack, doordat we display zowel als buffer als voor display doeleinden gebruiken moeten we het minteken
                // dat we voor display doeleinden hebben toegevoegd er weer afhalen
                if ($scope.plusMinusTyped) {
                    $scope.currentCalc.expression.push(Math.abs(+$scope.display));
                } else {
                    $scope.currentCalc.expression.push(+$scope.display);
                }
            } // else een close bracket is hiervoor uitgevoerd en die heeft al t werk gedaan
        }
    }


    $scope.selectAdvancedOperator = function() {
        selectFunctionDialog.showSelectFunctionDialog($scope.processFunctionSelected);
    }

    $scope.touchDigit = function(n) {
        addActionToCalcHistory('digit');
        if ($scope.numberEnteringState === false) {
            // de eerste keer dat een digit wordt ingetikt
            $scope.display = '' + n;
            $scope.numberEnteringState = true;
            if ($scope.plusMinusTyped) {
                $scope.operatorStr = '';
                $scope.display = '-' + $scope.display;
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
        addActionToCalcHistory('decimalSeparator');
        $scope.numberEnteringState = true; // needed if someone starts with period char
        // make sure you can only add decimal separator once
        // we always use the period char because js expression can only deal with US locale
        // only when we display a number then we do it localised
        if (!containsPeriodChar($scope.display)) {
            $scope.display = ($scope.display) + '.';
        } else {
            $scope.showErrorShake();
        }
    };


    // hier een scope functie van gemaakt om te kunnen testen
    $scope.processSelectedCalculation = function(calc) {
        var number = calc.result;
        if ($scope.plusMinusTyped) {
            number = -number;
        }
        $scope.display = number.toString();
        $scope.operatorStr = '';
        // state overgang
        selectedCalc = calc;  // zet vlag
        $scope.numberEnteringState = false;  // er is niet een getal ingetikt
        // les geleerd: je kan niet hier (makkelijk) al de calc toevoegen aan de expressie omdat je plus/min nog niet kan
        // verwerken. Je kan de calc pas toevoegen aan de expressie bij de operator of equals
    };


    // plus/min kan niet meteen zijn operator in expressie schrijven omdat je de plus/min ook na de operand kan doen
    // je moet daarom een vlag zetten en pas bij een state overgang de plus/min toevoegen
    // je hebt dit ook nodig bij een vorige calculatie
    // merk op dat een negatief resultaat ook een - teken heeft dat je met plus min ongedaan kan maken
    $scope.touchPlusMinOperator = function() {
        addActionToCalcHistory('plusMin');
        // een plusmin resulteert in een _ in de expressie (niet een -)
        if ($scope.numberEnteringState === false  && selectedCalc === null) {
            // er zijn twee mogelijkheden: 1) resultaat van de vorige calculatie  2) in de start state
            if ($scope.display != '0') {
                togglePlusMinDisplay();
            } else {
                if ($scope.plusMinusTyped) {
                    $scope.operatorStr = '';
                } else {
                    $scope.operatorStr = '-';
                }
            }
        } else {
            togglePlusMinDisplay();
        }
        $scope.plusMinusTyped = !$scope.plusMinusTyped;
    };

    function togglePlusMinDisplay() {
        if ($scope.display.charAt(0) === '-') {
            $scope.display = $scope.display.substring(1);
        } else {
            $scope.display = '-' + $scope.display;
        }
    };

    // binary operator
    $scope.touchOperator = function(operator) {
        addActionToCalcHistory('operator');
        // we should detect if an intermediate expression has been entered, situations:
        // 1)  getal ingetikt
        // 2)  variable gekozen
        // 3)  meteen een operator gekozen  (er is een vorige calculatie of we moeten de nul tovoegen)
        // 3)  haakje sluiten
        if ($scope.numberEnteringState
            || selectedCalc
            || $scope.currentCalc.expression.length == 0 // meteen een operator invoeren
            || ($scope.currentCalc.expression.length > 0 && $scope.currentCalc.expression[$scope.currentCalc.expression.length-1]=== ')')) {

            updateCurrentCalcExpression();
            $scope.currentCalc.expression.push(operator);
            if ($scope.numberEnteringState === true) {
                $scope.display = '0';
            }
        } else {
            // er was al een operator ingetikt, de (nieuwe) operator overschrijft de bestaande
            $scope.currentCalc.expression[$scope.currentCalc.expression.length-1] = operator;
        }
        // state overgang:
        $scope.operatorStr = operator;
        $scope.numberEnteringState = false;
        $scope.plusMinusTyped = false;
        selectedCalc = null;
    };


    // private, but added to scope for unit testing
    // an advanced operator like % or ^ or a conversion function has been selected by the user in the dialog
    $scope.processFunctionSelected = function(operator) {
        if (operator.length === 1) {
            $scope.touchOperator(operator);
        } else {
            addCommandToSheetHistory('conversion');
            // first some logic to determine the calculation to do the conversion with
            var calc;
            // verify whether equal has just been executed
            if ($scope.numberEnteringState || $scope.currentCalc.expression.length > 0) {
                if (selectedCalc) {
                    calc = selectedCalc;
                } else {
                    // add the current calc to the sheet
                    updateCurrentCalcExpression();
                    $scope.sheet.addCalculation($scope.currentCalc);
                    if (!$scope.processCalc()) {
                        // the calculation gave an error so let's remove the calc
                        $scope.sheet.deleteCalculation(0);
                        return; // exit
                    }
                    calc = $scope.currentCalc;
                }
            } else if ($scope.sheet.calculations.length===0) {
                // uitzonderingssituatie als er nog geen operand is ingevoerd
                $scope.currentCalc.expression.push(0);
                $scope.sheet.addCalculation($scope.currentCalc);
                $scope.processCalc();  // zou een doProcessCalc
                calc = $scope.currentCalc;
            } else {
                // we can reuse the previous calculation
                calc = $scope.sheet.calculations[0];
            }
            // do the actual conversion
            var conversionCalcPromise = conversionService.convert(operator, $scope.sheet, calc);
            conversionCalcPromise
                .then(function(conversionCalc) {
                    $scope.currentCalc = conversionCalc;
                    $scope.sheet.addCalculation(conversionCalc);
                    doProcessCalc();
                    setStatePostCalc();
                    $scope.hideWaitingIcon();
               },
               function(reason) {
                    // all error handling is within the conversionService
                    console.log('internal error, not expected ' + reason);
               });
        }
    }


    $scope.touchOpenBracket = function() {
        addActionToCalcHistory('openBracket');
        $scope.display = '0';
        if ($scope.plusMinusTyped) {
            $scope.currentCalc.expression.push('_');
        }
        $scope.currentCalc.expression.push('(');
        $scope.operatorStr = ''; // we hebben alles verwerkt, dus geen plusmin / operator meer tonen
        // state overgang:
        $scope.plusMinusTyped = false; // als er eentje was dan is ie nu gerest
    };


    // detect whether an operand has been entered: a number or expression closed with bracket
    // dit kan nu waarschijnlijk makkelijker
    function operandEnteredCLOSE() {
        return $scope.numberEnteringState === true || $scope.operatorStr === '';
    }

    $scope.touchCloseBracket = function() {
        addActionToCalcHistory('closeBracket');
        var countOpenBrackets = countOccurencesInExpression('(', $scope.currentCalc.expression);
        var countCloseBrackets = countOccurencesInExpression(')', $scope.currentCalc.expression);
        if (countOpenBrackets - countCloseBrackets >= 1  && operandEnteredCLOSE()) {
            updateCurrentCalcExpression();
            $scope.currentCalc.expression.push(')');
            // we closed an intermediate expression, now we start 'fresh', sort of mini reset
            // state overgang:
            miniReset();
        } else {
            $scope.showErrorShake();
        }
    };


    // in tegenstelling tot andere 'touches' bestaat de equals uit 2 zaken:
    // verwerkerking van de input tot aan de '=' en daarna het resultaat uitrekenen/tonen
    $scope.touchEqualsOperator = function() {
        addCommandToSheetHistory('equals'); // perhaps it would be wiser to have separate equals for each mode
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
        calcActionHistory = [];
    };

    $scope.equalsOperatorEditMode = function() {
        updateCurrentCalcExpression();
        // als de nieuwe expressie invald is dan terug naar backup
        try {
            doProcessCalc();
        } catch (e) {
            showAlertPopup('Invalid expression, reverting back to original expression');
            $scope.cancelEditMode();
        }
        $scope.reset();
    };

    $scope.equalsOperatorNormalMode = function() {
        // als twee keer achter elkaar = wordt ingedrukt dan is dit een short cut voor de remember functie
        // doordat een nieuw getal niet meteen expressionEnteringStart() aanroept kan result en display out of sync zijn
        // we eisen dat ze wel hetzelfde zijn voor de remember functie
        // perhaps we should throw in cmdHistory below as well
        if (calcActionHistory.length === 0) {
            this.touchRemember();
        } else {
            updateCurrentCalcExpression();
            // we need to the calc to the sheet for the calculation process
            $scope.sheet.addCalculation($scope.currentCalc);
            if (!$scope.processCalc($scope.currentCalc)) {
                // the calculation gave an error so let's remove the calc
                $scope.sheet.deleteCalculation(0);
            };
            setStatePostCalc();
        }
    };


    // put the result into the calculation calc
    // returns boolean whether the calculation was valid
    $scope.processCalc = function() {
        var result = true;
        try {
            doProcessCalc();
        } catch (e) {
            result = false;
            // the initial idea was to implement a kind of undo, but the last action is not necessarily
            // the one that triggers the error, e.g. 2 + cycle-calc + 3
            // so we fall back to a complete reset. If we would have a proper editor we could keep the expression
            // and let the user fix the expression. We could introduce an insert vs edit mode.
            miniReset();
            $scope.currentCalc = $scope.sheet.createNewCalculation();;
            $scope.result = null;
            var msg = e.message;
            showAlertPopup(msg);
         }
         return result;
    };

    // state overgang na een equals
    function setStatePostCalc() {
        $scope.operatorStr = '';
        $scope.numberEnteringState = false;
        $scope.plusMinusTyped = false;
        selectedCalc = null;
        calcActionHistory = [];
        startNewCalculation();
    };

    // assumes that calc is already added to sheet - needed for edit mode
    // this function will calculate the sheet and display the result of calc
    // doCalculateSheet zou beter zijn
    function doProcessCalc() {
        calcService.calculate($scope.sheet);
        if ($scope.currentCalc.result === null) {
            console.log('result null for ' + $scope.currentCalc.name + ' with expression '+ JSON.stringify($scope.currentCalc.expression));
            throw new Error('Invalid calculation');   // e.g. cycle in calculations
        }
        if (!isFinite($scope.currentCalc.result)) {
            console.log('result not isFinite for ' + $scope.currentCalc.name + ' with expression '+ JSON.stringify($scope.currentCalc.expression));
            throw new Error('Invalid calculation'); // e.g. divide by zero
        }
        $scope.display = $scope.currentCalc.result.toString();     // type is string
        sheetService.saveSheet($scope.sheet);
    }


    function deleteCharFromDisplay() {
        // we halen de numberEnteringState niet op de uit de lastAction omdat we de uitzondering willen ondersteunen
        // dat er geen vorige lastAction is, maar wel een resultaat van de vorige keer
        if ($scope.display.length===1)   {
            $scope.display = '0';
            $scope.numberEnteringState = false;
        } else {
            // getal bestaande uit meerdere cijfers ingetikt
            $scope.display = $scope.display.substring(0, $scope.display.length - 1);
            $scope.numberEnteringState = true;
        }
    };

    function restoreAction(action) {
        $scope.operatorStr = action.operatorStr;
        $scope.display = action.display;
        $scope.currentCalc.expression = action.expression;
        $scope.numberEnteringState = action.numberEnteringState;
        $scope.plusMinusTyped = action.plusMinusTyped;
    };

    // de delete is ook een undo-operator voor de huidige calc
    $scope.touchDelete = function() {
        addCommandToSheetHistory('delete');
        var lastAction = calcActionHistory.shift();
        if (!lastAction) {
            // het is mogelijk dat er wel wat in de display zit van vorige keer
            deleteCharFromDisplay();
        } else if (lastAction.id === 'digit') {
            restoreAction(lastAction);
        } else if (lastAction.id === 'decimalSeparator') {
            restoreAction(lastAction);
            // $scope.numberEnteringState zou ook nodig moeten zijn, een test die meteen met dec sep begint nodig
        } else if (lastAction.id === 'operator') {
            restoreAction(lastAction);
            $scope.operatorStr = '';  // dit is een twijfel geval
        } else if (lastAction.id === 'plusMin') {
            restoreAction(lastAction);
        } else if (lastAction.id === 'openBracket') {
            restoreAction(lastAction);
        } else if (lastAction.id === 'closeBracket') {
            restoreAction(lastAction);
            $scope.operatorStr = '';  // dit is een twijfel geval
        }
    }


});
