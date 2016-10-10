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

.controller('CalculatorCtrl', function($scope, $rootScope, $state, $stateParams, $log, $ionicModal, $ionicPopup, $timeout,
    calcService, sheetService, conversionService, renameDialogs, selectFunctionDialog, selectCalculationDialog) {

    var selectedCalc;  // een geselecteerde calc - via recall of een ander tabblad. Dit zou een flag/boolean moeten zijn
    var state = $stateParams;  // dit moeten we in app.js in de rootscope stoppen

    var resetDataMode = function() {
        $state.get('tab.calculator').data.mode = 'normal';
    }

    // use this function as a reset when bracket open or closed is entered
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

    };

    // dit komt overeen met de 'start' mode, initieel of na een clear, stop macro, stop edit
    $scope.reset = function() {
        miniReset();
        $scope.expression = [];     // array of Calculations, operators as string and numbers
        $scope.result = null;       // we check for null so do not make this undefined

        $scope.expressionEnteringState = false;   // geeft aan dat een nieuwe expression is gestart  (direct na equals is deze false)
        $scope.macroMode = false;   // an enum for the modes would be nicer
        $scope.editMode = false;
        $scope.editCalc = undefined; // the calc that is edited
        selectedCalc = null;            // de geselecteerde calc die bij pas bij operator of equals verwerkt wordt
        resetDataMode();
        /* if you want to play around with some preset data:
            $scope.expression = [2, '+', 3];
            $scope.result = 5;
        */
    };

    function init() {
        $scope.sheet = sheetService.getActiveSheet();
        $scope.reset();
    }

    // test utility method to reset the var names
    $scope._test_reset = function() {
        $scope.sheet.calculations = [];
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
            $scope.gotoEditMode($state.current.data.calc);
        } else if ($state.current.data.mode === 'use') {
            resetDataMode();  // we do not call reset() since we want to keep intermediate expression
            $scope.processSelectedCalculation($state.current.data.calc);
        }
    });

    // private
    $scope.gotoEditMode = function(calc) {
        $scope.reset();  // whipe out left overs
        $scope.editMode = true;
        $scope.editCalc = calc;
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
        $scope.reset();
    };

    $scope.cancelEditMode = function() {
        $scope.reset();
    };


    // detect whether an operand has been entered: a number or expression
    function operandEntered() {
       if ($scope.expression[$scope.expression.length-1] === ')') return true;
       else if (selectedCalc) return true;
       else return $scope.numberEnteringState === true;
    }


    function expressionEnteringStart() {
        $scope.expressionEnteringState = true;
        $scope.expression = [];
        $scope.result = null;
    }


    // copies the content from the display or selected calc to expression
    function updateScopeExpression() {
        // het kan zijn dat alleen een getal is ingetikt (de uitgestelde operatie), in dit geval
        // moeten we wel met een lege expressie starten
        if ($scope.numberEnteringState === true && $scope.expressionEnteringState===false) {
            expressionEnteringStart();
        }

        if (selectedCalc) {
            if ($scope.plusMinusTyped) {
                $scope.expression.push('_');
            }
            $scope.expression.push(selectedCalc);
            // reset flags below
        }
        // als de operator meteen wordt ingetikt na een vorige berekening, dan nemen we die berekening als input
        // de clear operatie onderbreekt dit, vandaar de test op display  (== test op start mode)
        else if (!operandEntered() && $scope.display!='0' && $scope.sheet.getMostRecentCalculation()) {
            // pas de vorige calculatie toe
            if ($scope.plusMinusTyped) {
                $scope.expression.push('_');
            }
            $scope.expression.push($scope.sheet.getMostRecentCalculation());
        }
        else if (!operandEntered()) {
            $scope.expression.push(0); // voeg getal 0 toe zodat de expressie altijd een operand heeft na de operator
        }
        else {
            // if a number is added to the display then we should add it to the expression
            if ($scope.plusMinusTyped) {
                $scope.expression.push('_'); // unaire min operator toevoegen
            }
            if ($scope.numberEnteringState === true) {
                // dit is een hack, doordat we display zowel als buffer als voor display doeleinden gebruiken moeten we het minteken
                // dat we voor display doeleinden hebben toegevoegd er weer afhalen
                if ($scope.plusMinusTyped) {
                    $scope.expression.push(Math.abs(+$scope.display));
                } else {
                    $scope.expression.push(+$scope.display);
                }
            } // else een close bracket is hiervoor uitgevoerd en die heeft al t werk gedaan
        }
    }

    // copies expression to calc
    function copyScopeExpressionToCalc(calc) {
        calc.expression = $scope.expression;
    }


    $scope.selectAdvancedOperator = function() {
        selectFunctionDialog.showSelectFunctionDialog($scope.processFunctionSelected);
    }

    $scope.touchDigit = function(n) {
        // merk op dat bij een nieuw getal we de vorige expression niet wissen!
        // inconsequent maar wel handig dat je de expressie van de vorige keer ziet
        // nu doen we dit pas bij de eerste operator expressionEnteringStart()
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
        // we always use the period char because js expression can only deal with US locale
        // only when we display a number then we do it localised
        if (!containsPeriodChar($scope.display)) {
            $scope.display = ($scope.display) + '.';
        } // consider: else show/give error signal - however not sure if we can do this in every error situation
    };


    // de delete is tegelijkertijd ook een undo-operator
    // het zou beter zijn geweest om deze te implementeren door de states op een stack te zetten
    // de state zou dan een object zijn met alle state properties
    // nadeel is dan wel dat je geen delete cijfer op een uitkomst kan doen, daar zou je dan toch aparte logica
    // voor moeten maken
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
                  (!$scope.numberEnteringState && !$scope.plusMinusTyped && $scope.operatorStr) ||
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
                    $scope.display = exprItem.result.toString();
                    $scope.numberEnteringState = false;
                } else {
                    $scope.display = exprItem.toString();
                    $scope.numberEnteringState = true;
                }
                // verwijder de operand en de operator/haakje
                $scope.expression.splice(length - 2, 2);
            }
        } else if (($scope.display.length===1) || ($scope.display.substring(0,1)==='-' && $scope.display.length===2))   {
            // getal bestaande uit 1 cijfer ingetikt met evt het min symbool
            // merk op dat er 2 oorzaken kunnen zijn; een negatief getal (uitkomst) of plusmin getikt
            if ($scope.display.length === 1) {
                // of 1 cijfer of alleen min
                $scope.plusMinusTyped = false;
                $scope.numberEnteringState = false;
                if (length > 0) {
                    $scope.operatorStr = $scope.expression[length-1];
                } else {
                    $scope.operatorStr = '';
                }
            } else if (($scope.display.length===2) && $scope.display.substring(0,1)==='-') {
                // alleen plusMin is nog over
                $scope.operatorStr = '-';
                $scope.numberEnteringState = false;
            }
            $scope.display = '0';
        } else {
            // getal bestaande uit meerdere cijfers ingetikt
            $scope.display = $scope.display.substring(0, $scope.display.length - 1);
            $scope.numberEnteringState = true;
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
        // make sure we start the expression (cause of the built-in delay)
        if (!$scope.expressionEnteringState) {
            expressionEnteringStart();
        }
        // les geleerd: je kan niet hier (makkelijk) al de calc toevoegen aan de expressie omdat je plus/min nog niet kan
        // verwerken. Je kan de calc pas toevoegen aan de expressie bij de operator of equals
    };


    $scope.touchRecall = function() {
        // notAllowedCalc is een beetje simpele benadering om een cycle (maar alleen eerstegraads) te vermijden
        var notAllowedCalc = $scope.editMode === true ?  $scope.editCalc : null;
        selectCalculationDialog.showSelectCalculationDialog($scope.sheet, notAllowedCalc, $scope.processSelectedCalculation);
    };

    $scope.touchRemember = function() {
        renameDialogs.showRenameCalculationDialog($scope.sheet.getMostRecentCalculation(), $scope.sheet);
    };

    // plus/min kan niet meteen zijn operator in expressie schrijven omdat je de plus/min ook na de operand kan doen
    // je moet daarom een vlag zetten en pas bij een state overgang de plus/min toevoegen
    $scope.touchPlusMinOperator = function() {
        // een plusmin resulteert in een _ in de expressie (niet een -)
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
        // uitzoeken waarom nog steeds nodig terwijl we dit in updateScopeExpression doen
        if (!$scope.expressionEnteringState) {
            expressionEnteringStart();
        }

        // we should detect if an intermediate expression has been entered, situations:
        // 1)  getal ingetikt
        // 2)  variable gekozen
        // 3)  meteen een operator gekozen  (er is een vorige calculatie of we moeten de nul tovoegen)
        // 3)  haakje sluiten
        if ($scope.numberEnteringState
            || selectedCalc
            || $scope.expression.length == 0 // meteen een operator invoeren
            || ($scope.expression.length > 0 && $scope.expression[$scope.expression.length-1]=== ')')) {

            updateScopeExpression();
            $scope.expression.push(operator);
            if ($scope.numberEnteringState === true) {
                $scope.display = '0';
            }
        } else {
            // er was al een operator ingetikt, de (nieuwe) operator overschrijft de bestaande
            $scope.expression[$scope.expression.length-1] = operator;
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
            var calc;
            // verify whether equal has just been executed
            if ($scope.numberEnteringState || $scope.expressionEnteringState) {
                if (selectedCalc) {
                    calc = selectedCalc;
                } else {
                    // there is an intermediate display / expression that we need to put into a separate calc
                    updateScopeExpression();
                    calc = $scope.sheet.createNewCalculation();
                    copyScopeExpressionToCalc(calc);
                    $scope.sheet.addCalculation(calc);
                    if (!$scope.processCalc(calc)) {
                        // the calculation gave an error so let's remove the calc
                        $scope.sheet.deleteCalculation(0);
                        return; // exit
                    }
                }
            } else if ($scope.sheet.calculations.length===0) {
                // uitzonderingssituatie als er nog geen operand is ingevoerd
                calc = $scope.sheet.createNewCalculation();
                calc.expression.push(0);
                $scope.sheet.addCalculation(calc);
                $scope.processCalc(calc);
            } else {
                // we can reuse the previous calculation
                calc = $scope.sheet.calculations[0];
            }
            var conversionCalcPromise = conversionService.convert(operator, $scope.sheet, calc);
            conversionCalcPromise
                .then(function(conversionCalc) {
                    $scope.sheet.addCalculation(conversionCalc);
                    $scope.expression = conversionCalc.expression;
                    doProcessCalc(conversionCalc)
                    $scope.hideWaitingIcon();
               },
               function(reason) {
                    // all error handling is within the conversionService
                    console.log('internal error, not expected ' + reason);
               });
            // TODO: touchOperator does some post processing that is missing here..
        }
    }


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
        // state overgang:
        // niets veranderd
    };


    // detect whether an operand has been entered: a number or expression closed with bracket
    function operandEnteredCLOSE() {
        return $scope.numberEnteringState === true || $scope.operatorStr === '';
    }

    $scope.touchCloseBracket = function() {
        var countOpenBrackets = countOccurencesInExpression('(', $scope.expression);
        var countCloseBrackets = countOccurencesInExpression(')', $scope.expression);
        if (countOpenBrackets - countCloseBrackets >= 1  && operandEnteredCLOSE()) {
            updateScopeExpression();
            $scope.expression.push(')');
            // we closed an intermediate expression, now we start 'fresh', sort of mini reset
            // state overgang:
            miniReset();
        } else {
            // more close brackets as open brackets, we ignore this for now
            // todo: error signal
        }
    };


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
        updateScopeExpression();
        copyScopeExpressionToCalc($scope.editCalc);
        $scope.processCalc($scope.editCalc);
        $scope.editMode = false;
    };

    $scope.equalsOperatorNormalMode = function() {
        // als twee keer achter elkaar = wordt ingedrukt dan is dit een short cut voor de remember functie
        // doordat een nieuw getal niet meteen expressionEnteringStart() aanroept kan result en display out of sync zijn
        // we eisen dat ze wel hetzelfde zijn voor de remember functie
        if ($scope.result && $scope.result.toString() === $scope.display) {
            this.touchRemember();
        } else {
            updateScopeExpression();
            var calc = $scope.sheet.createNewCalculation();
            copyScopeExpressionToCalc(calc);
            $scope.sheet.addCalculation(calc);
            if (!$scope.processCalc(calc)) {
                // the calculation gave an error so let's remove the calc
                $scope.sheet.deleteCalculation(0);
            };
        }
    };

    // put the result into the calculation calc and show the result in display and expression panel
    // returns whether the calculation was valid
    $scope.processCalc = function(calc) {
        var result = true;
        try {
            doProcessCalc(calc);
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
         // state overgang
         $scope.operatorStr = '';
         $scope.numberEnteringState = false;
         $scope.expressionEnteringState = false;
         $scope.plusMinusTyped = false;
         selectedCalc = null;
         return result;
    };

    // assumes that calc is already added to sheet - needed for edit mode
    // this function will calculate the sheet and display the result of calc
    function doProcessCalc(calc) {
        calcService.calculate($scope.sheet);
        if (calc.result === null) {
            console.log('result null for ' + calc.name + ' with expression '+ JSON.stringify(calc.expression));
            throw new Error('Invalid calculation');   // e.g. cycle in calculations
        }
        if (!isFinite(calc.result)) {
            console.log('result not isFinite for ' + calc.name + ' with expression '+ JSON.stringify(calc.expression));
            throw new Error('Invalid calculation'); // e.g. divide by zero
        }
        $scope.result = calc.result;                 // type is number
        $scope.display = calc.result.toString();     // type is string
        sheetService.saveSheet($scope.sheet);
    }


});
