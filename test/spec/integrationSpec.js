'use strict';

describe('Integration test', function () {

    beforeEach(module('calcworks'));

    var $controller, $rootScope, sheetSrvc;

    beforeEach(inject(function(_$rootScope_, _$controller_, sheetService){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        sheetSrvc = sheetService;
    }));

    describe('integration sheetService - CalculatorCtrl', function() {
        var $scope, controller;

        beforeEach(function() {
            $scope = $rootScope.$new(); // we need the $on event in CalculatorCtrl
            controller = $controller('CalculatorCtrl', { $scope: $scope });
        });

        it('smoke test', function() {
            expect(sheetSrvc.getActiveSheet().calculations.length).toBe(0);
            expect($scope.display).toBe('0');
            $scope.touchDigit(5);
            $scope.touchOperator('+');
            $scope.touchDigit(2);
            $scope.touchEqualsOperator();
            expect($scope.display).toBe('7');
            expect(sheetSrvc.getActiveSheet().calculations.length).toEqual(1);
        });

    });

});


