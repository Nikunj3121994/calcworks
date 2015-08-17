"use strict";

angular.module('calcworks.services')
    .service('calcService', function ($log) {

        function CalculationError(message) {
            this.name = 'CalculationError';
            this.message = message;
        }
        CalculationError.prototype = new Error();
        CalculationError.prototype.constructor = CalculationError;


        // replaces
        // private
        this.resolveExpression = function(calculation, calculations, state) {
            var resolvedExpression = '';
            var expressionLength = calculation.expression.length;
            for (var i = 0; i < expressionLength; i++) {
                var calc = calculation.expression[i];
                if (calc instanceof Calculation) {
                    if (!calc.result) {
                        this.calcCalculation(calculations, calc, state);
                        // double check if indeed calculated
                        if (!calc.result) {
                            calculations.errorlog.undefinedVariables.push('"' + calc.varName + '" is undefined');
                            //consider: add varname to outcomes as NaN or null to avoid re-calculation
                        }
                    }
                    resolvedExpression = resolvedExpression + ' ' + calc.result;
                } else {
                    resolvedExpression = resolvedExpression + ' ' + calc;
                }
            }
            return resolvedExpression;
        };

        // private
        this.calcCalculation = function(calculations, calculation, state) {
            if (calculation.result) {
                //$log.log('calcCalculation, already known ' + calculation.varName + ' : ' + calculation.expression + ' = ' + calculation.result);
            } else {
                if (calculation.varName in state.varNamesInCalculation) {
                    throw new CalculationError('Circular reference; "' + calculation.varName + '" refers to a calculation that refers back to itself');
                }
                state.varNamesInCalculation[calculation.varName] = true;
                //$log.log('calcCalculation: about to process: ' + calculation.varName + ' : ' + calculation.expression);
                var expression = this.resolveExpression(calculation, calculations, state);
                //$log.log('calcCalculation: and ' + calculation.varName + ' resolved into: ' + expression);
                var outcome;
                try {
                    expression = this.replaceMultiplyPercentageOperators(expression);
                    outcome = eval(expression);
                    //$log.log('  calcCalculation, eval ' + calculation.varName  + ' : ' + expression + ' = ' + outcome);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        $log.log('  calcCalculation; ' + calculation.varName  + ' : ' + expression);
                        outcome = 'syntax error';
                    } else {
                        outcome = 'error';
                    }
                }
                calculation.result = outcome;
                delete state.varNamesInCalculation[calculation.varName];
            }
        };

        //private, made this function a method to enable unit testing - maybe not needed
        this.replaceMultiplyPercentageOperators= function(expression) {
            // replace percentage operator with divide by 100 and multiply
            expression = expression.replace(/x/g, '*');
            expression = expression.replace(/%/g, '/ 100 *');
            return expression;
        };


        this.calculate = function(sheet) {
            //$log.log('---------- calculate ------------');
            var calculations = sheet.calculations;
            var state = {}; // container for data during the calculation
            state.varNamesInCalculation = Object.create(null);  // list varnames that are being calculated
            calculations.errorlog = {};  // output variable for errors
            calculations.errorlog.undefinedVariables = [];
            calculations.errorlog.circularReference = null;
            var sum = 0;
            try {
                var arrayLength = calculations.length;
                for (var i = 0; i < arrayLength; i++) {
                    calculations[i].result = null;
                }
                for (var i = 0; i < arrayLength; i++) {
                    this.calcCalculation(calculations, calculations[i], state);
                    sum = sum + calculations[i].result;
                }
                // we slaan altijd de sum op om risico te voorkomen dat ie out of sync gaat lopen
                sheet.sum = sum;
            } catch (error) {
                calculations.errorlog.circularReference = error.message;
            }
        };


        this.countVarNames = function(varName, calculations) {
            var count = 0;
            var arrayLength = calculations.length;
            for (var i = 0; i < arrayLength; i++) {
                if (calculations[i].varName === varName) {
                    count += 1;
                }
            }
            return count;
        };


});
