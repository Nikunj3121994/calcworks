"use strict";

angular.module('calcworks.controllers')


.directive('resolveSheet', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            sheet: '=',
            index: '='
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
                    template = template + '<td class="itemExpr" style="width: 100px">' + $rootScope.convertNumberToDisplay(calculation.result) + '</td>';
                    template = template + '<td class="itemExpr">  &nbsp;=&nbsp;  </td>';
                    var arrayLength = expression.length;
                    for (var i = 0; i < arrayLength; i++) {
                        template = template + '<td class="itemExpr">' + $rootScope.getExprItemAsString(expression[i], scope.sheet) + '</td>';
                    }
                    template = template + '</tr>';
                    // second row
                    template = template + '<tr>';
                    template = template + '<td class="calcNameExpr">' + calculation.varName + '</td>';
                    template = template + '<td></td>';
                    for (var i = 0; i < arrayLength; i++) {
                        if (expression[i] instanceof Calculation) {
                            template = template + '<td class="calcNameExpr">' + expression[i].varName + '</td>';
                        } else {
                            template = template + '<td></td>';
                        }
                    }
                    template = template + '</tr>';
                    template = template + '</table>';
                    // since we resolve the parameters above there is no need to compile
                    element.html(template);
                } else {
                    console.log('resolveSheet called with NO new value');
                }

            }, true); // true is deep dirty checking
        }
    };
})
.directive('resolveExpression', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            expression: '=',
            sheet: '=',
            result: '='  //optional since might not be there yet
        },
        link: function(scope, element) {
            scope.$watch('expression', function(newValue, oldValue) {
                if (newValue) {
                    var template = '';
                    var arrayLength = scope.expression.length;
                    for (var i = 0; i < arrayLength; i++) {
                        template = template + '<span class="itemExpr">' + $rootScope.getExprItemAsString(scope.expression[i], scope.sheet) + '</span>';
                    }
                    if (scope.result !== undefined && scope.result !== null) {
                        template = template + '<span class="itemExpr"> = ' + $rootScope.convertNumberToDisplay(scope.result) + '</span>';
                    }
                    // since we resolve the parameters above there is no need to compile
                    element.html(template);
                }
            }, true); // true is deep dirty checking
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
                console.log('not active ' + scope.sheet.id);
            }
        }
    };
});

// there is another way to implement this directive and that is by using templating. However this gives less
// control of including the calcNames. ng-if still included the dom elements. Probably because of the one-time, ahead
// compilation of the template
//
// Notice $root instead of rootScope
// template = template + '<span>{{$root.getExprItemAsString(expression[' + i + '], sheet)}}</span>';
//
// in this case we also have to compile the template:
//
//var linkFn = $compile(template);
//var content = linkFn(scope);
//element.replaceWith(content);
