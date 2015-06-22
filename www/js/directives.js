"use strict";

angular.module('calcworks.controllers')

.directive('resolveExpression', function($rootScope, $compile) {
    return {
        restrict: 'E',
        scope: {
            expression: '=',
            sheet: '='
        },
        link: function(scope, element) {
            var template = '';
            var arrayLength = scope.expression.length;
            for (var i = 0; i < arrayLength; i++) {
                // we keep line below if it comes in handy later. Notice $root instead of rootScope
                // template = template + '<span>{{$root.getExprItemAsString(expression[' + i + '], sheet)}}</span>';
                template = template + '<span  class="itemExpr">' + $rootScope.getExprItemAsString(scope.expression[i], scope.sheet) + '</span>';
                if (isCalcName(scope.expression[i])) {
                    template = template + '<span class="calcNameExpr">' + $rootScope.getExprItemIfCalcName(scope.expression[i]) + '</span>';
                }
            }
            var linkFn = $compile(template);
            var content = linkFn(scope);
            element.append(content);
        }
    };
});
