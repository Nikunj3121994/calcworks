"use strict";

angular.module('calcworks.services')
    .service('calcService', function ($log) {

        function CalculationError(message) {
            this.name = 'CalculationError';
            this.message = message;
        }
        CalculationError.prototype = new Error();
        CalculationError.prototype.constructor = CalculationError;

        // private
        this.calcVarname = function(calculations, calcName, state) {
            if (calcName in state.varNamesInCalculation) {
                throw new CalculationError('Circular reference; "' + calcName + '" refers to a calculation that refers back to "' + calcName + '"');
            }
            var arrayLength = calculations.length;
            for (var i = 0; i < arrayLength; i++) {
                if (calculations[i].varName === calcName) {
                    state.varNamesInCalculation[calcName] = true;
                    this.calcCalculation(calculations, calculations[i], state);
                    delete state.varNamesInCalculation[calcName];
                    //nice-to-have: optimize - with return since varname is unique and no need for further processing
                }
            }
        };

        // private
        this.resolveExpression = function(calculation, calculations, state) {
            //var expression = calculation.expression;
            //var varnames = calculation.parseVarsExpression();
            //if (varnames && varnames.length > 0) {
            //    var varnamesLength = varnames.length;
            //    for (var i = 0; i < varnamesLength; i++) {
            //        if (!state.outcomes[varnames[i]]) {
            //            this.calcVarname(calculations, varnames[i], state);
            //            if (!state.outcomes[varnames[i]]) {
            //                calculations.errorlog.undefinedVariables.push('"' + varnames[i] + '" is undefined');
            //                //consider: add varname to outcomes as NaN or null to avoid re-calculation
            //            }
            //        }
            //        expression = this.replaceAllVars(varnames[i], state.outcomes[varnames[i]], expression);
            //    }
            //}
            var resolvedExpression = '';
            var calculationLength = calculation.expression.length;
            for (var i = 0; i < calculationLength; i++) {
                if (isCalcName(calculation.expression[i])) {
                    var calcName = calculation.expression[i];
                    if (!state.outcomes[calcName]) {
                        this.calcVarname(calculations, calcName, state);
                        // double check if calculated
                        if (!state.outcomes[calcName]) {
                            calculations.errorlog.undefinedVariables.push('"' + calcName + '" is undefined');
                            //consider: add varname to outcomes as NaN or null to avoid re-calculation
                        }
                    }
                    resolvedExpression = resolvedExpression + ' ' + state.outcomes[calcName];
                } else {
                    resolvedExpression = resolvedExpression + ' ' + calculation.expression[i];
                }
            }
            return resolvedExpression;
        };

        // private
        this.calcCalculation = function(calculations, calculation, state) {
            if (state.outcomes[calculation.varName]) {
                $log.log('calcCalculation, already known ' + calculation.varName + ' : ' + calculation.expression + ' = ' + calculation.result);
            } else {
                $log.log('calcCalculation: about to process: ' + calculation.varName + ' : ' + calculation.expression);
                var expression = this.resolveExpression(calculation, calculations, state);
                $log.log('calcCalculation: and ' + calculation.varName + ' resolved into: ' + expression);
                calculation.resolvedExpression = expression;
                var outcome;
                try {
                    // replace percentage operator with divide by 100 and multiply
                    expression = expression.replace(/%/g, ' / 100 *');
                    outcome = eval(expression);
                    $log.log('  calcCalculation, eval ' + calculation.varName  + ' : ' + expression + ' = ' + outcome);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        outcome = 'syntax error';
                    } else {
                        outcome = 'error';
                    }
                }
                calculation.result = outcome;
                state.outcomes[calculation.varName] = outcome;
            }
        };


        // public, we should change/improve the signature by passing in sheet
        this.calculate = function(calculations) {
            $log.log('---------- calculate ------------');
            var state = {}; // container for data during the calculation
            state.outcomes = Object.create(null);  // list of key-value pairs <varname, value>
            state.varNamesInCalculation = Object.create(null);  // list varnames that are being calculated
            calculations.errorlog = {};  // output variable for errors
            calculations.errorlog.undefinedVariables = [];
            calculations.errorlog.circularReference = null;
            try {
                var arrayLength = calculations.length;
                for (var i = 0; i < arrayLength; i++) {
                    this.calcCalculation(calculations, calculations[i], state);
                }
            } catch (error) {
                calculations.errorlog.circularReference = error.message;
            }
        };


        //// private
        //// note parameters find and replace need to be safe, otherwise escape them first
        //this.replaceAllVars = function(find, replace, str) {
        //    return str.replace(new RegExp('\\b' + find + '\\b', 'g'), replace);
        //};


        //// private
        //this.renameVarInExpressions = function(oldName, newName, calculations) {
        //    var arrayLength = calculations.length;
        //    for (var i = 0; i < arrayLength; i++) {
        //        calculations[i].expression = this.replaceAllVars(oldName, newName, calculations[i].expression);
        //    }
        //};

        // public
        this.renameVar = function(calculation, newName, sheet) {
            var oldName = calculation.varName;
            calculation.varName = newName;
            this.renameVarInExpressions(oldName, newName, sheet.calculations);
        };

        // obsolet with ionic.Utils.nextUid();
        this.generateUUID = function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
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


//        function escapeRegExp(string) {
//            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
//        }

});
