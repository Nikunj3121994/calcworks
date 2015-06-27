"use strict";

angular.module('calcworks.controllers')


    //    <a class="sheetsCol" style="display:inline-block;text-align: left;width: 30%">{{calc.varName}}:</a>
    //<span style="display:inline-block;width: 50%">
    //    </span>
    //    <span class="sheetsCol" style="display:inline-block;width: 20%"> {{calc.result|toFixedDecimals}} </span>


.directive('resolveExpression', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            sheet: '=',
            index: '='
        },
        link: function(scope, element) {
            if (!scope.sheet) throw new Error('illegal argument sheet');
            console.log('>>> start ' + scope.index +'  ' +  scope.sheet.calculations[scope.index].expression);
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
            template = template + '</tr><tr>';
            template = template + '<td class="calcNameExpr">' + calculation.varName + '</td>';
            template = template + '<td></td>';
            for (var i = 0; i < arrayLength; i++) {
                if (isCalcName(expression[i])) {
                    template = template + '<td class="calcNameExpr">' + $rootScope.getExprItemIfCalcName(expression[i]) + '</td>';
                } else {
                    template = template + '<td></td>';
                }
            }
            template = template + '</tr>';
            template = template + '</table>';
            console.log('>>> einde ' + template);
            // since we resolve the parameters above there is no need to compile
            element.html(template);
        }
    };
})
.directive('resolveExpressionWatch', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            expression: '=',
            sheet: '=',
            result: '='  //optional
        },
        link: function(scope, element) {
            scope.$watch('expression', function(newValue, oldValue) {
                if (newValue) {
                    var template = '';
                    var arrayLength = scope.expression.length;
                    for (var i = 0; i < arrayLength; i++) {
                        template = template + '<span  class="itemExpr">' + $rootScope.getExprItemAsString(scope.expression[i], scope.sheet) + '</span>';
                    }
                    if (scope.result) {
                        template = template + '<span  class="itemExpr"> = ' + $rootScope.convertNumberToDisplay(scope.result) + '</span>';
                    }
                }
                // since we resolve the parameters above there is no need to compile
                element.html(template);
            }, true); // true is deep dirty checking
        }
    };
});

// there is another way to implement this directive and that is by using templating. However this gives less
// control of including the calNames. ng-if still included the dom elements. Probably because of the one-time, ahead
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
