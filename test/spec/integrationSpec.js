'use strict';

describe('Integration test', function () {

    // load the app - included services
    beforeEach(module('calcworks'));

    var calcltrCtrl,
        sheetSrvc,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, calcService, sheetService) {
        scope = $rootScope.$new();
        calcltrCtrl = $controller('CalculatorCtrl', {
            $scope: scope,
            calcService: calcService,
            sheetService: sheetService
        });
        sheetSrvc = sheetService;
    }));


    it('verify new active sheet', function () {
        sheetSrvc.createNewActiveSheet();
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('7');
        expect(sheetSrvc.getActiveSheet().calculations.length).toEqual(1);
    });

});


