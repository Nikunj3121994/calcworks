"use strict";

angular.module('calcworks.controllers')

// zou eigenlijk ook resolveCalculation moeten heten, dit is de twee-regel variant, volgende vorm:
//
//     result    =   ...expression...
//      name               name
.directive('resolveSheet', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            sheet: '=',
            index: '=',
            numberDisplayOption: '='
        },
        link: function(scope, element) {
            // we doen een deep watch van de sheet zodat calcNames veranderingen ook gedetecteerd worden
            scope.$watch('sheet', function(newValue, oldValue) {
                if (newValue) {
                    // note: logic duplicated into sheetHtmlService, we might need to keep the two in sync
                    if (!scope.sheet) throw new Error('illegal argument sheet');
                    var calculation = scope.sheet.calculations[scope.index];
                    var expression = calculation.expression;
                    var template = '';
                    template = '<table class="expressionTable">';
                    template = template + '<tr>';
                    template = template + '<td class="itemExpr" style="width: 100px">' + $rootScope.convertNumberForRendering(calculation.result, scope.sheet.numberDisplayOption) + '</td>';
                    template = template + '<td class="itemExpr">  &nbsp;=&nbsp;  </td>';
                    var arrayLength = expression.length;
                    for (var i = 0; i < arrayLength; i++) {
                        template = template + '<td class="itemExpr">' + $rootScope.getExprItemForRendering(expression[i], scope.sheet.numberDisplayOption, false) + '</td>';
                    }
                    template = template + '</tr>';
                    // second row
                    template = template + '<tr>';
                    template = template + '<td class="calcNameExpr">' + calculation.name + '</td>';
                    template = template + '<td></td>';
                    for (var i = 0; i < arrayLength; i++) {
                        if (expression[i] instanceof Calculation) {
                            template = template + '<td class="calcNameExpr">' + expression[i].name + '</td>';
                        } else {
                            template = template + '<td></td>';
                        }
                    }
                    template = template + '</tr>';
                    template = template + '</table>';
                    // since we resolve the parameters above there is no need to compile
                    element.html(template);
                } else {
                    //console.log('resolveSheet called with NO new value');
                }

            }, true); // true is deep dirty checking
        }
    };
})
.directive('resolveExpression', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            calculation: '=',
            displayCalculationName: '=',   // optional flag, display calculation name instead of its result
            showResult: '=',                // optional flag, display result, default true
            numberDisplayOption: "="
        },
        link: function(scope, element) {

            function updateElement(calculation) {
                    var template = '';
                    var arrayLength = calculation.expression.length;
                    for (var i = 0; i < arrayLength; i++) {
                        template = template + '<span class="itemExpr">';
                        template = template + $rootScope.getExprItemForRendering(calculation.expression[i], scope.numberDisplayOption, scope.displayCalculationName);
                        template = template + '</span>';
                    }
                    var showResult = scope.showResult;
                    if (showResult == undefined) { showResult = true; }
                    if (calculation.result !== undefined && calculation.result !== null  && showResult) {
                        template = template + '<span class="itemExpr"> = ' + $rootScope.convertNumberForRendering(calculation.result, scope.numberDisplayOption) + '</span>';
                    }
                    // since we resolve the parameters above there is no need to compile
                    element.html(template);
            }

            // we need to deep watch expression and result
            scope.$watch('calculation', function(newValue, oldValue) {
                if (newValue) {
                    updateElement(scope.calculation);
                }
            }, true); // true is deep dirty checking (so no reference check)


        }
    };
})
.directive('resolveInputDisplay', function() {
    return {
        restrict: 'E',
        scope: {
            numberstr: '='
        },
        link: function(scope, element) {
            scope.$watch('numberstr', function(newValue, oldValue) {
                if (newValue) {
                    // since we resolve the parameters above there is no need to compile
                    // we cannot use string.tolocale function because that would remove dec separator and trailing zero's
                    element.html(localiseDisplayNumberStr(scope.numberstr));
                }
            }, false);
        }
    };
})
.directive('activeSheetFlag', function(sheetService) {
    return {
        restrict: 'E',
        scope: {
            sheet: '=',
        },
        link: function(scope, element) {
            if (sheetService.getActiveSheet().id === scope.sheet.id) {
                element.html('(active)');
            } else {
                //console.log('not active ' + scope.sheet.id);
            }
        }
    };
});

// there is another way to implement this directive and that is by using templating. However this gives less
// control of including the calcNames. ng-if still included the dom elements. Probably because of the one-time, ahead
// compilation of the template
//
// Notice $root instead of rootScope
// template = template + '<span>{{$root.getExprItemForRendering(expression[' + i + '], sheet)}}</span>';
//
// in this case we also have to compile the template:
//
//var linkFn = $compile(template);
//var content = linkFn(scope);
//element.replaceWith(content);
