'use strict';


describe('Test controller CalculatorCtrl', function () {

    // load the app - included services
    beforeEach(module('calcworks'));


    var CalculatorCtrl,
        sheetService,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, calcService, _sheetService_) {
        scope = $rootScope.$new();
        sheetService = _sheetService_;
        // we need to supply an empty sheet for each test to make sure everything is 'clean'
        // however, strictly speaking this should not be necessary, I suspect that one failing test is a bug
        // on the other hand some tests require that the first variable is 'calc1'
        //sheetService.getActiveSheet = getActiveSheet;
        sheetService.saveSheet = function(sheet) {}; // we kunnen beter spyOn gebruiken
        CalculatorCtrl = $controller('CalculatorCtrl', {
          $scope: scope,
          calcService: calcService,
          sheetService: sheetService
        });
        // below reset is a bit odd, should not be necessary. I suspect that somewhere there is still some data
        // loaded from storage
        scope._test_reset();
    }));


    function mockBackEnd() {
        httpBackend.expectGET('templates/tab-sheets.html').respond(200); //mimicking the AJAX call
        httpBackend.expectGET('templates/sheet-detail.html').respond(200);
        httpBackend.expectGET('templates/tab-calculator.html').respond(200);
        httpBackend.expectGET('templates/tabs.html').respond(200);
    }


    it('verify behavior processSelectedCalculation', function () {
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([2, '+', 3]);
        expect(scope.sheet.calculations[0].result).toEqual(5);
        var calc1 = scope.sheet.calculations[0];

        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('10');
        var name = scope.sheet.calculations[0].name;
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', calc1]);
        expect(scope.sheet.calculations[0].result).toEqual(10);

        // verify decimals
        scope._test_reset();
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([1, '/', 3]);
        expect(scope.display).toContain('0.33333333');

        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        expect(scope.display).toContain('0.333333333');
        scope.touchEqualsOperator();
        expect(scope.display).toContain('2.33333333');
    });

    it('verify behavior processSelectedCalculation 2', function () {
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([2, '+', 3]);
        var calc1 = scope.sheet.calculations[0];

        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchOperator('+');
        expect(scope.currentCalc.expression).toEqual([calc1, '+']);
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', 4]);
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', 4]);
        expect(scope.sheet.calculations[0].result).toEqual(9);
    });

    it('verify behavior processSelectedCalculation 3', function () {
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([2, '+', 3]);
        var calc1 = scope.sheet.calculations[0];

        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('10');
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', calc1]);
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', calc1]);
        var calc2 = scope.sheet.calculations[0];

        scope.processSelectedCalculation(scope.sheet.calculations[1]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', calc2, '+', calc2]);
        expect(scope.display).toBe('25');
        expect(scope.sheet.calculations[0].result).toEqual(25);
    });


    it('verify behavior processSelectedCalculation with calculation from other sheet ', function () {
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([2, '+', 3]);
        var calc1 = scope.sheet.calculations[0];
        calc1.name = 'c1';
        var sheet1 = scope.sheet;

        sheetService.createNewActiveSheet();
        expect(scope.sheet.calculations.length).toEqual(0);

        scope.processSelectedCalculation(calc1, sheet1);
        expect(scope.sheet.calculations.length).toEqual(0);
        scope.touchOperator('+');
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.sheet.calculations.length).toEqual(1);
        // since calc1 comes from a different sheet, it must be a copy (same name, same value but with different id)
        expect(scope.sheet.calculations[0].expression[0].name).toEqual(calc1.name);
        expect(scope.sheet.calculations[0].expression[0] === calc1).toBeFalsy();
    });


    it('verify behavior processSelectedCalculation with selected calculation from activeSheet', function () {
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        var calc1 = scope.sheet.calculations[0];

        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0], sheetService.getActiveSheet());
        scope.touchEqualsOperator();
        expect(scope.display).toBe('4');
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '+', calc1]);
    });


});
