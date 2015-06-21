"use strict";

angular.module('calcworks.controllers')

    // merk op dat er al een filter resolve bestaat. Deze doet alleen de superscript niet, dat gaat ook lukken in een filter
    // filter doet wel decimale afkappen
    // $rootScope.convertNumberToDisplay(value);
.directive('resolveExpression', function($rootScope) {
    return {
        restrict: 'E',
        scope: {
            expression: '=',
            sheet: '='
        },
        template: '<span ng-repeat="item in expression track by $index">{{$root.getExprItemAsString(item, sheet)}}<ng-if="isCalcName(item)"><span class="overlay">{{$root.getExprItemIfCalcName(item)}}</span></ng-if> </span>'
    };
});
