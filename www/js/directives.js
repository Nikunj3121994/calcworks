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
        //dit heeft als nadeel dat er altijd een sup element is ook al is item leeg
        template: '<span ng-repeat="item in expression track by $index">{{$root.getExprItemAsString(item, sheet)}} <sup>{{$root.getExprItemIfCalcName(item)}}</sup></span>'
    };
});
