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
                template = template + '<span>{{$root.getExprItemAsString(expression[' + i + '], sheet)}}</span>';
                if (isCalcName(scope.expression[i])) {
                    template = template + '<span class="overlay">{{$root.getExprItemIfCalcName(expression[' + i + '])}}</span>';
                }
            }
            var linkFn = $compile(template);
            var content = linkFn(scope);
            element.append(content);
        }
    };
});
