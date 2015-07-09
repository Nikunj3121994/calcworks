'use strict';


describe('Test controller CalculatorCtrl', function () {

    // load the app - included services
    beforeEach(module('calcworks'));


    var CalculatorCtrl,
        scope,
        sheet = new Sheet('id', 'foo', []);

    var getActiveSheet = function() {
        return sheet;
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, calcService, sheetService) {
        scope = $rootScope.$new();
        //rootScope = $rootScope;
        // we need to supply an empty sheet for each test to make sure everything is 'clean'
        // however, strictly speaking this should not be necessary, I suspect that one failing test is a bug
        // on the other hand some tests require that the first variable is 'calc1'
        sheetService.getActiveSheet = getActiveSheet;
        CalculatorCtrl = $controller('CalculatorCtrl', {
          $scope: scope,
          calcService: calcService,
          sheetService: sheetService
        });
    }));


    it('verify touch digit', function () {
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        expect(scope.display).toBe('5');
        scope.touchDigit(1);
        expect(scope.display).toBe('51');
    });


    it('verify decimal separator', function() {
        expect(scope.display).toBe('0');

        scope.touchDecimalSeparator();
        expect(scope.display).toBe('0.');

        scope.reset();

        expect(scope.display).toBe('0');

        scope.touchDigit(3);
        scope.touchDecimalSeparator();
        expect(scope.display).toBe('3.');

        scope.touchDigit(0);
        expect(scope.display).toBe('3.0');

        // ignore multiple decimal separators
        scope.reset();
        scope.touchDigit(3);
        scope.touchDecimalSeparator();
        expect(scope.display).toBe('3.');
        scope.touchDecimalSeparator();
        expect(scope.display).toBe('3.');

    });


    it('verify plus, min, reset', function () {
        expect(scope.display).toBe('0');

        // plus operation
        scope.touchDigit(5);
        expect(scope.display).toBe('5');
        scope.touchDigit(0);
        expect(scope.display).toBe('50');

        expect(scope.numberEnteringState).toBe(true);
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([ 50, '+' ]);
        expect(scope.operatorStr).toBe('+');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');
        expect(scope.expression).toEqual([ 50, '+' ]);

        scope.touchEqualsOperator();
        expect(scope.display).toBe('59');
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([ 50, '+' , 9]);
        expect(scope.result).toEqual(59);

        scope.reset();
        expect(scope.display).toBe('0');

        // min operation
        scope.touchDigit(9);
        scope.touchDigit(1);
        scope.touchOperator('-');
        expect(scope.operatorStr).toBe('-');
        scope.touchDigit(9);
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-2');
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([91, '-', 93]);
        expect(scope.result).toEqual(-2);
    });


    it('verify override touchOperator', function () {
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        scope.touchOperator('-');
        expect(scope.operatorStr).toBe('-');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('3');
    });


    it('verify touchDelete', function() {
        expect(scope.display).toBe('0');

        scope.touchDigit(3);
        scope.touchDelete();
        expect(scope.display).toBe('0');

        scope.reset();
        scope.touchDelete();
        expect(scope.display).toBe('0');

        scope.reset();
        scope.touchDigit(3);
        scope.touchDecimalSeparator();
        scope.touchDelete();
        expect(scope.display).toBe('3');
        scope.touchDelete();
        expect(scope.display).toBe('0');

        scope.reset();
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(6);
        scope.touchDelete();
        scope.touchDigit(4);
        expect(scope.expression).toEqual([2, '+']);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.result).toEqual(6);
    });


    it('verify touchDelete extended', function() {
        expect(scope.display).toBe('0');
        scope.touchDigit(1);
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(6);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('18');

        scope.touchDelete();
        expect(scope.display).toBe('1');
        scope.touchDigit(4);
        expect(scope.display).toBe('14');
        expect(scope.result).toEqual(18);
    });

    it('verify touchPlusMin', function() {
        expect(scope.display).toBe('0');
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('-');
        scope.touchDigit(4);
        expect(scope.display).toBe('-4');
        scope.touchPlusMinOperator();
        expect(scope.operatorStr).toBe('');
        expect(scope.display).toBe('4');

        scope.reset();
        scope.touchDigit(4);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-4');
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('4');

        scope.reset();
        scope.touchDecimalSeparator();
        scope.touchDigit(4);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-0.4');

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchDigit(2);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-8');
        expect(scope.result).toEqual(-8);

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchPlusMinOperator();
        scope.touchDigit(2);
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-8');
        expect(scope.result).toEqual(-8);
    });


    it('verify operator touched multiple times', function () {
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toEqual([5, '+']);
        // repeat, should not have effect on display
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toEqual([5, '+']);
        // continue with normal sequence
        scope.touchDigit(3);
        scope.touchOperator('*');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('*');
        expect(scope.expression).toEqual([5, '+', 3, '*']);
    });


    it('verify result', function() {
        scope.touchDigit(4);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.result).toBe(6);

        scope.touchDigit(3);
        expect(scope.display).toBe('3');
        expect(scope.result).toBe(6); // weet niet zeker of je dit ook echt wilt
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.result).toBe(null);
        scope.touchDigit(5);
        expect(scope.display).toBe('5');
        expect(scope.result).toBe(null);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('8');
        expect(scope.result).toBe(8);
    });


    it('verify start meteen met een operator', function() {
        expect(scope.display).toBe('0');
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
    });


    it('verify display; multiply', function () {
        scope.touchDigit(5);
        expect(scope.display).toBe('5');

        scope.touchOperator('x');
        expect(scope.operatorStr).toBe('x');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('45');
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([5, 'x', 9]);
        expect(scope.result).toEqual(45);
    });


    it('verify display; divide', function () {
        expect(scope.display).toBe('0');

        scope.touchDigit(1);
        expect(scope.display).toBe('1');

        scope.touchDigit(5);
        expect(scope.display).toBe('15');

        scope.touchOperator('/');
        expect(scope.display).toBe('0');
        //        expect(scope.display).toBe('15'); still under discussion
        expect(scope.operatorStr).toBe('/');

        scope.touchDigit(3);
        expect(scope.display).toBe('3');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.operatorStr).toBe('');
        expect(scope.result).toEqual(5);
    });


    it('verify display; percentage', function () {
        expect(scope.display).toBe('0');

        scope.touchDigit(8);
        scope.touchDigit(0);
        scope.touchDigit(0);
        expect(scope.display).toBe('800');

        scope.touchOperator('%');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('%');

        scope.touchDigit(4);
        expect(scope.display).toBe('4');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('32');
        expect(scope.operatorStr).toBe('');
        expect(scope.result).toEqual(32);
    });

    it('verify brackets', function() {
        // (4+5)=
        expect(scope.display).toBe('0');
        scope.touchOpenBracket();
        expect(scope.expression).toEqual(['(']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(4);
        expect(scope.display).toBe('4');
        expect(scope.expression).toEqual(['(']);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toEqual(['(', 4, '+']);
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        scope.touchCloseBracket();
        expect(scope.expression).toEqual(['(', 4, '+', 5, ')']);
        expect(scope.operatorStr).toBe('');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.expression).toEqual(['(', 4, '+', 5, ')']);
        expect(scope.operatorStr).toBe('');
        expect(scope.result).toEqual(9);

        // (4) + 5
        scope.reset();
        expect(scope.operatorStr).toBe('');
        scope.touchOpenBracket();
        expect(scope.expression).toEqual(['(']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(4);
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual(['(', 4, ')']);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toEqual(['(', 4, ')', '+']);
        scope.touchDigit(5);
        expect(scope.expression).toEqual(['(', 4, ')', '+']);
        expect(scope.operatorStr).toBe('+');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.expression).toEqual(['(', 4, ')', '+', 5]);
        expect(scope.operatorStr).toBe('');
        expect(scope.result).toEqual(9);
    });

    it('verify open bracket after expression entered', function() {
        // enter a dummy expression
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.result).toEqual(14);
        // start with open bracket, this should reset the expression
        scope.touchOpenBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([ 5, '+', 9, '(']);
        expect(scope.operatorStr).toBe('');
        expect(scope.result).toEqual(14);
    });


    it('verify resolved expression', function () {
        scope._test_reset();

        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.expression).toEqual([5, '+', 9]);
        expect(scope.result).toEqual(14);

        scope.touchOperator('-');
        scope.touchDigit(9);
        expect(scope.expression).toEqual(['calc1', '-']);  // directive should show '14 -'
        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.expression).toEqual(['calc1', '-', 9]);
        expect(scope.result).toEqual(5);

    });


    it('verify behavior with zero - basic', function () {
        expect(scope.display).toBe('0');

        scope.touchDigit(0);
        expect(scope.display).toBe('0');

        scope.touchDigit(5);
        expect(scope.display).toBe('5');
    });

    it('verify behavior with zero - advanced', function () {
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.expression).toEqual([5, '+', 9]);
        expect(scope.result).toEqual(14);

        scope.touchDigit(0);
        expect(scope.display).toBe('0');
        scope.touchDecimalSeparator();
        expect(scope.display).toBe('0.');
    });


    it('verify behavior with brackets', function () {
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([]);
        expect(scope.operatorStr).toBe('');
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([]);
        expect(scope.operatorStr).toBe('');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchCloseBracket();
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual(['(' , 5, ')']);

        scope.reset();
        scope.touchOpenBracket();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchCloseBracket();
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual(['(' , '(', 5, ')', ')']);

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        scope.touchCloseBracket();
        // expect error signal
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual(['(', 5, '+']);
    });


    it('verify behavior with equals', function () {
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.expression).toEqual([5, '+', 0]);
        expect(scope.result).toEqual(5);

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.expression).toEqual(['(', 5, '+', 1, ')']);
        expect(scope.result).toEqual(6);
    });


    it('verify behavior processSelectedCalculation', function () {
        scope._test_reset();
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([2, '+', 3]);
        expect(scope.result).toEqual(5);

        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('10');
        // als we meer testen toevoegen zal calc17 niet meer kloppen en moeten we de varname ophalen
        var varName = sheet.calculations[0].varName;
        expect(scope.expression).toEqual(['calc1', '+', 'calc1']);
        expect(sheet.calculations[0].expression).toEqual(['calc1', '+', 'calc1']);
        expect(scope.result).toEqual(10);
    });


    it('verify behavior processSelectedCalculation 2', function () {
        scope._test_reset();
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([2, '+', 3]);

        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        expect(scope.expression).toEqual([]); // een nieuwe expressie is door een variabele gestart
        scope.touchOperator('+');
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.expression).toEqual(['calc1', '+', 4]);
        expect(sheet.calculations[0].expression).toEqual(['calc1', '+', 4]);
        expect(scope.result).toEqual(9);
    });

    it('verify behavior processSelectedCalculation 3', function () {
        scope._test_reset();
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([2, '+', 3]);

        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('10');
        expect(sheet.calculations[0].expression).toEqual(['calc1', '+', 'calc1']);
        expect(scope.expression).toEqual(['calc1', '+', 'calc1']);

        scope.processSelectedCalculation(getActiveSheet().calculations[1]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchEqualsOperator();
        expect(sheet.calculations[0].expression).toEqual(['calc1', '+', 'calc2', '+', 'calc2']);
        expect(scope.expression).toEqual(['calc1', '+', 'calc2', '+', 'calc2']);
        expect(scope.display).toBe('25');
        expect(scope.result).toEqual(25);
    });

    it('verify behavior decimal rounding', function () {
        scope._test_reset();
        scope.touchDigit(3);
        scope.touchOperator('/');
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('3');
        expect(scope.result).toEqual(3);

        scope._test_reset();
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('0.33');
        expect(scope.result).toEqual(1 / 3);
    });

    it('verify division by zero', function () {
        scope._test_reset();
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(0);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('error');
        expect(isFinite(scope.result)).toBeFalsy();
    });

});
