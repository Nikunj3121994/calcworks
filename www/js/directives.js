"use strict";

angular.module('calcworks.controllers')

.directive('resolveExpression', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            expression: '=',
            sheet: '='
        },
        link: function(scope, element) {
            scope.$watch('expression', function(newValue, oldValue) {
                if (newValue) {
                    var template = '';
                    var arrayLength = scope.expression.length;
                    for (var i = 0; i < arrayLength; i++) {
                        template = template + '<span  class="itemExpr">' + $rootScope.getExprItemAsString(scope.expression[i], scope.sheet) + '</span>';
                        if (isCalcName(scope.expression[i])) {
                            template = template + '<span class="calcNameExpr">' + $rootScope.getExprItemIfCalcName(scope.expression[i]) + '</span>';
                        }
                    }
                    // since we resolve the parameters above there is no need to compile
                    element.html(template);
                }
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
