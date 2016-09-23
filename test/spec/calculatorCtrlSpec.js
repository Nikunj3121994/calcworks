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


    it('verify behavior thousand separators', function () {
        scope.touchDigit(4);
        scope.touchDigit(3);
        scope.touchDigit(2);
        scope.touchDigit(1);
        expect(scope.display).toBe('4321');
    });

    it('verify very basic scenario', function() {
        scope.touchDigit(5);
        scope.touchEqualsOperator();
        expect(getActiveSheet().calculations.length).toBe(1);
        expect(getActiveSheet().calculations[0].result).toBe(5);
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

        scope.reset();
        scope.touchDigit(9);
        scope.touchOperator('-');
        expect(scope.operatorStr).toBe('-');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([9, '-', 9]);
        expect(scope.result).toEqual(0);
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
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
    });

    it('verify touchDelete numbers', function() {
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

    it('verify touchDelete operator', function() {
        scope.touchDigit(3);
        scope.touchOperator('x');
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([]);
        expect(scope.display).toBe('3');

        scope.reset();
        scope.touchDigit(3);
        scope.touchOperator('x');
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([3, 'x']);
        expect(scope.display).toBe('2');
        scope.touchDigit(9);
        expect(scope.display).toBe('29');

        scope.reset();
        scope.touchDigit(3);
        scope.touchOperator('x');
        scope.touchDigit(0);
        scope.touchOperator('+');
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([3, 'x']);
        expect(scope.display).toBe('0');
        scope.touchDigit(9);
        expect(scope.display).toBe('9');

        scope._test_reset()
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        var calc1 = scope.sheet.calculations[0];
        scope.touchOperator('+');
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([]);
        expect(scope.display).toBe('0.33');
        scope.touchOperator('x');
        expect(scope.expression).toEqual([calc1, 'x']);
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([calc1, 'x', 3]);
        expect(scope.display).toBe('1');
    });


    it('verify touchDelete open bracket', function() {
        // open bracket
        scope.reset();
        scope.touchOpenBracket();
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([]);
        expect(scope.display).toBe('0');

        scope.reset();
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchOpenBracket();
        scope.touchDelete();
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual([1, '+', 2]);
        expect(scope.display).toBe('3');
    });

    it('verify touchDelete close bracket', function() {
        scope.touchOpenBracket();
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchCloseBracket();
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toEqual(['(', 1, '+']);
        expect(scope.display).toBe('3');
        // we gaan verder met edit
        scope.touchOperator('x');
        scope.touchDigit(4);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual(['(', 1, '+', 3, 'x', 4, ')']);
        expect(scope.display).toBe('13');
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


    it('verify touchDelete extended with plusmin', function() {
        expect(scope.display).toBe('0');
        scope.touchDigit(4);
        scope.touchOperator('x');
        scope.touchPlusMinOperator();
        scope.touchDigit(6);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-24');
        expect(scope.plusMinusTyped).toBeFalsy();

        scope.touchDelete();
        expect(scope.display).toBe('-2');
        scope.touchOperator('x');
        expect(scope.expression).toEqual([-2, 'x']);
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([-2, 'x', 4]);
        expect(scope.display).toBe('-8');
        expect(scope.result).toEqual(-8);
    });


    it('verify touchDelete plusmin', function() {
        scope.touchPlusMinOperator();
        scope.touchDigit(2);
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.plusMinusTyped).toBeTruthy();
        expect(scope.operatorStr).toBe('-');
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.plusMinusTyped).toBeFalsy();
        expect(scope.operatorStr).toBe('');

        scope.reset();
        scope.touchDigit(9);
        scope.touchPlusMinOperator();
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.plusMinusTyped).toBeTruthy();
        expect(scope.operatorStr).toBe('-');
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.plusMinusTyped).toBeFalsy();
        expect(scope.operatorStr).toBe('');

        // 1 + -2
        scope.reset();
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchPlusMinOperator();
        scope.touchDigit(6);
        scope.touchDelete();
        expect(scope.expression).toEqual([2, '+']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('-');
        scope.touchDigit(9);
        expect(scope.expression).toEqual([2, '+']);
        expect(scope.display).toBe('-9');
        expect(scope.operatorStr).toBe('');

        // -(
        scope.reset();
        scope.touchPlusMinOperator();
        scope.touchOpenBracket();
        expect(scope.expression).toEqual(['_', '(']);
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual(['_']);
        expect(scope.operatorStr).toBe('-');
        expect(scope.plusMinusTyped).toBeTruthy();
        scope.touchDelete();
        expect(scope.expression).toEqual([]);
        expect(scope.operatorStr).toBe('');
        expect(scope.plusMinusTyped).toBeFalsy();
        expect(scope.display).toBe('0');

        // 5 + -(
        scope.reset();
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchPlusMinOperator();
        scope.touchOpenBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([5, '+', '_', '(']);
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([5, '+', '_']);
        expect(scope.operatorStr).toBe('-');
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.expression).toEqual([5, '+' ]);
        expect(scope.operatorStr).toBe('+');
    });


    it('verify touchPlusMin', function() {
        expect(scope.display).toBe('0');
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('-');
        expect(scope.plusMinusTyped).toBeTruthy();
        scope.touchDigit(4);
        expect(scope.display).toBe('-4');  // dit is eigenlijk niet goed, zou gewoon 4 moeten zijn
        expect(scope.plusMinusTyped).toBeTruthy();
        expect(scope.operatorStr).toBe('');
        scope.touchPlusMinOperator();
        expect(scope.operatorStr).toBe('');
        expect(scope.display).toBe('4');
        expect(scope.plusMinusTyped).toBeFalsy();

        scope.reset();
        scope.touchDigit(4);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-4');
        expect(scope.plusMinusTyped).toBeTruthy();
        expect(scope.operatorStr).toBe('');
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('4');
        expect(scope.operatorStr).toBe('');
        expect(scope.plusMinusTyped).toBeFalsy();

        scope.reset();
        scope.touchDecimalSeparator();
        scope.touchDigit(4);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-0.4');

        scope.reset();
        scope.touchDigit(4);
        scope.touchPlusMinOperator();
        scope.touchOperator('*');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual(['_', 4, '*', 2]);
        expect(scope.display).toBe('-8');
        expect(scope.result).toEqual(-8);

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchDigit(2);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([4, '*', '_', 2]);
        expect(scope.display).toBe('-8');
        expect(scope.result).toEqual(-8);

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchPlusMinOperator();
        scope.touchDigit(2);
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([4, '*', '_', 2]);
        expect(scope.display).toBe('-8');
        expect(scope.result).toEqual(-8);
    });

    it('verify touchPlusMin with var', function() {
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        var calc = sheet.calculations[0];

        scope.touchDigit(3);
        scope.touchOperator('*');
        scope.touchPlusMinOperator();
        scope.processSelectedCalculation(calc);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-12');

        scope.reset();
        scope.touchDigit(6);
        scope.touchPlusMinOperator();
        scope.touchOperator('*');
        expect(scope.plusMinusTyped).toBeFalsy();
        scope.processSelectedCalculation(calc);
        expect(scope.plusMinusTyped).toBeFalsy();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-24');

        scope.reset();
        scope.processSelectedCalculation(calc);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-4');
        expect(scope.plusMinusTyped).toBeTruthy();
        expect(scope.operatorStr).toBe('');
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('4');
        expect(scope.plusMinusTyped).toBeFalsy();
        expect(scope.operatorStr).toBe('');

        // test met een calc die negatief is
        scope.reset();
        scope.touchDigit(9);
        scope.touchPlusMinOperator();
        scope.touchEqualsOperator();
        var calc = sheet.calculations[0];
        expect(calc.result).toBe(-9);

        scope.touchDigit(3);
        scope.touchOperator('*');
        scope.processSelectedCalculation(calc);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-27');

        scope.reset();
        scope.touchPlusMinOperator();
        scope.processSelectedCalculation(calc);
        scope.touchEqualsOperator();
        // scope.expression is - - 9, niet mooi, maar ook wel weer eenduidig
        expect(scope.display).toBe('9');

        // test met haakjes
        scope.reset();
        scope.touchPlusMinOperator();
        scope.touchOpenBracket();
        scope.touchDigit(9);
        scope.touchOperator('+');
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-10');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(9);
        scope.touchOperator('+');
        scope.touchPlusMinOperator();
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchOperator('+');
        scope.touchPlusMinOperator();
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');

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

        scope.reset();
        scope.touchDigit(0);
        scope.touchOperator('/');
        scope.touchDigit(5);
        expect(scope.result).toBeNull();
    });


    // for now we do not keep an expression that results into an error
    it('verify division by zero', function () {
        expect(getActiveSheet().calculations.length).toBe(0);
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(0);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([]);
        expect(scope.display).toBe('0');
        expect(scope.result).toBe(null);
        expect(getActiveSheet().calculations.length).toBe(0);
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
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.expression).toEqual([5, '+', 9]);
        expect(scope.result).toEqual(14);
        var calc1 = scope.sheet.calculations[0];

        scope.touchOperator('-');
        scope.touchDigit(9);
        expect(scope.expression).toEqual([calc1, '-']);  // directive should show '14 -'
        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.expression).toEqual([calc1, '-', 9]);
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
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([2, '+', 3]);
        expect(scope.result).toEqual(5);
        var calc1 = scope.sheet.calculations[0];

        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('10');
        var name = sheet.calculations[0].name;
        expect(scope.expression).toEqual([calc1, '+', calc1]);
        expect(sheet.calculations[0].expression).toEqual([calc1, '+', calc1]);
        expect(scope.result).toEqual(10);

        // verify decimals
        scope._test_reset();
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([1, '/', 3]);
        expect(scope.display).toContain('0.33333333');

        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        expect(scope.display).toContain('0.333333333');
        scope.touchEqualsOperator();
        expect(scope.display).toContain('2.33333333');
    });


    it('verify behavior processSelectedCalculation 2', function () {
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([2, '+', 3]);
        var calc1 = scope.sheet.calculations[0];

        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        expect(scope.expression).toEqual([]); // een nieuwe expressie is door een variabele gestart
        scope.touchOperator('+');
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.expression).toEqual([calc1, '+', 4]);
        expect(sheet.calculations[0].expression).toEqual([calc1, '+', 4]);
        expect(scope.result).toEqual(9);
    });

    it('verify behavior processSelectedCalculation 3', function () {
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.expression).toEqual([2, '+', 3]);
        var calc1 = scope.sheet.calculations[0];

        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('10');
        expect(sheet.calculations[0].expression).toEqual([calc1, '+', calc1]);
        expect(scope.expression).toEqual([calc1, '+', calc1]);
        var calc2 = scope.sheet.calculations[0];

        scope.processSelectedCalculation(getActiveSheet().calculations[1]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchOperator('+');
        scope.processSelectedCalculation(getActiveSheet().calculations[0]);
        scope.touchEqualsOperator();
        expect(sheet.calculations[0].expression).toEqual([calc1, '+', calc2, '+', calc2]);
        expect(scope.expression).toEqual([calc1, '+', calc2, '+', calc2]);
        expect(scope.display).toBe('25');
        expect(scope.result).toEqual(25);
    });

    it('verify behavior decimal rounding', function () {
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
        expect(scope.display).toContain('0.333333333');
        expect(scope.result).toEqual(1 / 3);
    });

    it('verify two times touch equal = remember', function() {
        spyOn(scope, 'touchRemember');
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(getActiveSheet().calculations.length).toBe(0);
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(getActiveSheet().calculations.length).toBe(1);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(1);
        expect(getActiveSheet().calculations.length).toBe(1);
        // nog een keer
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(2);
        expect(getActiveSheet().calculations.length).toBe(1);
    });

    it('verify two times touch equal = remember - repeated', function() {
        spyOn(scope, 'touchRemember');
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(getActiveSheet().calculations.length).toBe(0);
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(getActiveSheet().calculations.length).toBe(1);
        scope.touchEqualsOperator();
        expect(getActiveSheet().calculations.length).toBe(1);
        expect(scope.touchRemember.calls.count()).toEqual(1);
        // nog een keer met een ander getal
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(1);
        expect(getActiveSheet().calculations.length).toBe(2);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(2);
        expect(getActiveSheet().calculations.length).toBe(2);
    });

    it('verify edit mode', function() {
        // setup fixture
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(getActiveSheet().calculations[0].result).toBe(9);
        // go to edit mode
        scope.editMode = true;
        scope.editCalc = getActiveSheet().calculations[0];
        scope.touchDigit(7);
        scope.touchEqualsOperator();
        expect(getActiveSheet().calculations[0].result).toBe(7);
        scope.cancelEditMode();

        // again with bit more complex expression
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(getActiveSheet().calculations.length).toBe(2);
        // go to edit mode
        scope.editMode = true;
        scope.editCalc = getActiveSheet().calculations[0]; // most recent calc
        scope.touchDigit(4);
        scope.touchOperator('+');
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(getActiveSheet().calculations.length).toBe(2);
        expect(getActiveSheet().calculations[0].result).toBe(8);
        expect(getActiveSheet().calculations[1].result).toBe(7);
    });

    it('verify edit mode virtual cycle', function() {
        // setup simple fixture
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        var calc1 = scope.sheet.calculations[0];
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        var calc2 = scope.sheet.calculations[0];

        // start creating the cycle
        calc1.expression = [calc2];
        calc1.result = calc2.result;

        // go to edit mode for calc2
        scope.reset();
        scope.editMode = true;
        scope.editCalc = getActiveSheet().calculations[0];
        scope.processSelectedCalculation(calc1);
        scope.touchEqualsOperator();
        // the equals should reset
        expect(calc2.expression).toEqual([]);
        expect(calc2.result).toEqual(null);
        expect(scope.display).toEqual('0');
    });


    it('verify just-make-sure display', function() {
        scope.touchDigit(1);
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchDecimalSeparator();
        expect(scope.display).toEqual('2.');
        scope.touchDigit(1);
        expect(scope.display).toEqual('2.1');
        scope.touchEqualsOperator();
        expect(scope.display).toEqual('1000002.1');
        // door het directief wordt 100,002.1 (localised) getoond
    });


    it('verify zero bug in display', function() {
        scope.touchDecimalSeparator();
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchDigit(0);
        scope.touchDigit(3);
        scope.touchOperator('x');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.display).toEqual('0.0006');
    });


    it('verify rounding', function() {
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toContain('0.3333');
        scope.touchOperator('*');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toEqual('1');
    });


});
