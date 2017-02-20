'use strict';


describe('Test controller CalculatorCtrl', function () {

    // load the app - included services
    beforeEach(module('calcworks'));


    var CalculatorCtrl,
        conversionService,
        httpBackend,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q, $httpBackend, calcService, sheetService, _conversionService_) {
        scope = $rootScope.$new();
        conversionService = _conversionService_;
        httpBackend = $httpBackend;
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

    it('verify clear', function() {
        expect(scope.sheet.calculations.length).toBe(0);
        scope.touchDigit(5);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(1);
        expect(scope.display).toBe('5');
        // nu komt ie:
        scope.touchClear();
        expect(scope.display).toBe('0');
        expect(scope.sheet.calculations.length).toBe(1);
        // nieuwe sheet
        spyOn(scope, 'createNewSheetAfterConfirmation');
        scope.touchClear();
        expect(scope.createNewSheetAfterConfirmation).toHaveBeenCalled();
    });

    it('verify clear extended', function() {
        scope.touchDigit(5);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(1);
        expect(scope.display).toBe('5');
        // nu komt ie:
        scope.touchClear();
        scope.touchDigit(1);
        // nieuwe sheet
        //spyOn(scope, 'createNewSheetAfterConfirmation');
        scope.touchClear();
        expect(scope.display).toBe('0');
        //expect(scope.createNewSheetAfterConfirmation).toHaveBeenCalled();
    });

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
        // do not execute $animate.addClass
        spyOn(scope, 'showErrorShake');
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
        expect(scope.sheet.calculations.length).toBe(1);
        expect(scope.sheet.calculations[0].result).toBe(5);

        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(2);
        expect(scope.sheet.calculations[0].result).toBe(3);
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
        expect(scope.currentCalc.expression).toEqual([ 50, '+' ]);
        expect(scope.operatorStr).toBe('+');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');
        expect(scope.currentCalc.expression).toEqual([ 50, '+' ]);

        scope.touchEqualsOperator();
        expect(scope.display).toBe('59');
        expect(scope.operatorStr).toBe('');
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.sheet.calculations[0].expression).toEqual([ 50, '+' , 9]);
        expect(scope.sheet.calculations[0].result).toEqual(59);
        expect(scope.currentCalc.result).toBeNull();

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
        expect(scope.sheet.calculations[0].expression).toEqual([91, '-', 93]);
        expect(scope.sheet.calculations[0].result).toEqual(-2);

        scope.reset();
        scope.touchDigit(9);
        scope.touchOperator('-');
        expect(scope.operatorStr).toBe('-');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        expect(scope.sheet.calculations[0].expression).toEqual([9, '-', 9]);
        expect(scope.sheet.calculations[0].result).toEqual(0);
    });


    it('verify power function', function () {
        scope.reset();
        scope.touchDigit(2);
        scope.touchOperator('^');
        expect(scope.operatorStr).toBe('^');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('8');
        expect(scope.operatorStr).toBe('');
        expect(scope.sheet.calculations[0].expression).toEqual([2, '^', 3]);
        expect(scope.sheet.calculations[0].result).toEqual(8);

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


    it('verify touchPlusMin', function() {
        expect(scope.display).toBe('0');
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('-');
        expect(scope.plusMinusTyped).toBeTruthy();
        scope.touchDigit(4);
        expect(scope.display).toBe('-4');  // mooier zou zijn als dit 4 is en het directive -4 afbeeldt
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
        expect(scope.sheet.calculations[0].expression).toEqual(['_', 4, '*', 2]);
        expect(scope.display).toBe('-8');
        expect(scope.sheet.calculations[0].result).toEqual(-8);

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchDigit(2);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([4, '*', '_', 2]);
        expect(scope.display).toBe('-8');
        expect(scope.sheet.calculations[0].result).toEqual(-8);

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchPlusMinOperator();
        scope.touchDigit(2);
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([4, '*', '_', 2]);
        expect(scope.display).toBe('-8');
        expect(scope.sheet.calculations[0].result).toEqual(-8);
    });

    it('verify touchPlusMin with negative result as first operand', function() {
        scope.touchDigit(4);
        scope.touchOperator('-');
        scope.touchDigit(6);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-2');
        var calc1 = scope.sheet.calculations[0];

        scope.touchPlusMinOperator();
        expect(scope.display).toBe('2');
        expect(scope.operatorStr).toBe('');
        scope.touchOperator('+');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        // we eisen haakjes om de calc1 omdat je anders - - calc1 krijgt
        expect(scope.sheet.calculations[0].expression).toEqual(['_', '(', calc1, ')', '+', 3]);
        expect(scope.sheet.calculations[0].result).toEqual(5);
    });

    it('verify touchPlusMin with negative recall', function() {
        scope.touchPlusMinOperator();
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        var calc = scope.sheet.calculations[0];

        scope.reset();
        scope.processSelectedCalculation(calc);
        scope.touchPlusMinOperator();
        expect(scope.display).toBe('4');
        expect(scope.operatorStr).toBe('');
    });


    it('verify touchPlusMin with var', function() {
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        var calc = scope.sheet.calculations[0];
        expect(calc.expression).toEqual([4]);

        scope.touchDigit(3);
        scope.touchOperator('x');
        expect(scope.currentCalc.expression).toEqual([3 , 'x']);
        scope.touchPlusMinOperator();
        scope.processSelectedCalculation(calc);
        expect(scope.currentCalc.expression).toEqual([3 , 'x']);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([3 , 'x', '_', calc]);
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
        var calc = scope.sheet.calculations[0];
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
        // scope.currentCalc.expression is - - 9, niet mooi, maar ook wel weer eenduidig
        expect(scope.display).toBe('9');

        // test met haakjes en plusmin
        scope.reset();
        scope.touchPlusMinOperator();
        scope.touchOpenBracket();
        expect(scope.currentCalc.expression).toEqual(['_' ,'(']);
        expect(scope.operatorStr).toEqual(''); // de plusmin is verwerkt, dus niet meer tonen
        scope.touchDigit(9);
        scope.touchOperator('+');
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual(['_' ,'(', 9, '+', 1, ')']);
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

    it('verify touchPlusMin with previous result', function() {
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        var calc = scope.sheet.calculations[0];
        expect(calc.expression).toEqual([4]);

        scope.touchPlusMinOperator();
        scope.touchOperator('x');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual(['_' , calc, 'x', 3]);
        expect(scope.sheet.calculations[0].result).toEqual(-12);
    });


    it('verify touchPlusMin with previous negative result', function() {
        scope.touchDigit(4);
        scope.touchOperator('-');
        scope.touchDigit(6);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-2');
        var calc1 = scope.sheet.calculations[0];

        scope.touchDigit(3);
        scope.touchOperator('+');
        scope.touchPlusMinOperator();
        scope.processSelectedCalculation(calc1);
        scope.touchEqualsOperator();
        // we eisen haakjes om de calc1 omdat je anders - - calc1 krijgt
        expect(scope.sheet.calculations[0].expression).toEqual([3, '+', '_', '(', calc1, ')']);
        expect(scope.sheet.calculations[0].result).toEqual(5);
    });


    it('verify operator touched multiple times', function () {
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
        expect(scope.currentCalc.expression).toEqual([5, '+']);
        // repeat, should not have effect on display
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
        expect(scope.currentCalc.expression).toEqual([5, '+']);
        // continue with normal sequence
        scope.touchDigit(3);
        scope.touchOperator('*');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('*');
        expect(scope.currentCalc.expression).toEqual([5, '+', 3, '*']);
    });


    // beetje overbodig test, was noodzakelijk omdat we in t verleden t result van de vorige zo lang mogelijk lieten zien
    it('verify result', function() {
        scope.touchDigit(4);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.sheet.calculations[0].result).toBe(6);
        expect(scope.currentCalc.result).toBeNull();

        scope.touchDigit(3);
        expect(scope.display).toBe('3');
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.result).toBe(null);
        scope.touchDigit(5);
        expect(scope.display).toBe('5');
        expect(scope.currentCalc.result).toBeNull();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('8');
        expect(scope.currentCalc.result).toBeNull();
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
        expect(scope.sheet.calculations[0].expression).toEqual([5, 'x', 9]);
        expect(scope.sheet.calculations[0].result).toEqual(45);
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
        expect(scope.sheet.calculations[0].result).toEqual(5);

        scope._test_reset();
        scope.touchDigit(0);
        scope.touchOperator('/');
        scope.touchDigit(5);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].result).toEqual(0);
    });


    // we do keep an expression that results into an error
    it('verify division by zero', function () {
        expect(scope.sheet.calculations.length).toBe(0);
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(0);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(1);
        expect(scope.sheet.calculations[0].expression).toEqual([1 ,'/', 0]);
        expect(scope.sheet.calculations[0].result).toBe(Infinity);
        // ik kies ervoor om display niet gelijk te maken aan 'error' achtige tekst te tonen, dat heeft te veel gevolgen
        // we kunnen in de toekomst nog wel een animatie tonen
        expect(scope.display).toEqual('0');
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
        expect(scope.sheet.calculations[0].result).toEqual(32);
    });

    it('verify brackets', function() {
        // (4+5)=
        expect(scope.display).toBe('0');
        scope.touchOpenBracket();
        expect(scope.currentCalc.expression).toEqual(['(']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(4);
        expect(scope.display).toBe('4');
        expect(scope.currentCalc.expression).toEqual(['(']);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.currentCalc.expression).toEqual(['(', 4, '+']);
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        scope.touchCloseBracket();
        expect(scope.currentCalc.expression).toEqual(['(', 4, '+', 5, ')']);
        expect(scope.operatorStr).toBe('');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.sheet.calculations[0].expression).toEqual(['(', 4, '+', 5, ')']);
        expect(scope.operatorStr).toBe('');
        expect(scope.sheet.calculations[0].result).toEqual(9);

        // (4) + 5
        scope._test_reset();
        expect(scope.operatorStr).toBe('');
        scope.touchOpenBracket();
        expect(scope.currentCalc.expression).toEqual(['(']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(4);
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual(['(', 4, ')']);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.currentCalc.expression).toEqual(['(', 4, ')', '+']);
        scope.touchDigit(5);
        expect(scope.currentCalc.expression).toEqual(['(', 4, ')', '+']);
        expect(scope.operatorStr).toBe('+');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.sheet.calculations[0].expression).toEqual(['(', 4, ')', '+', 5]);
        expect(scope.operatorStr).toBe('');
        expect(scope.sheet.calculations[0].result).toEqual(9);

        // 3 + (1)
        scope._test_reset();
        scope.touchDigit(3);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        scope.touchOpenBracket();
        expect(scope.currentCalc.expression).toEqual([3, '+', '(']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('4');
        expect(scope.operatorStr).toBe('');
        expect(scope.sheet.calculations[0].expression).toEqual([3, '+', '(', 1, ')']);
        expect(scope.sheet.calculations[0].result).toEqual(4);
    });

    it('verify open bracket after calculation entered', function() {
        // enter a dummy expression
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.sheet.calculations[0].result).toEqual(14);
        // start with open bracket, this should reset the expression
        scope.touchOpenBracket();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual([ '(']);
        expect(scope.operatorStr).toBe('');
    });


    it('verify resolved expression', function () {
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.sheet.calculations[0].expression).toEqual([5, '+', 9]);
        expect(scope.sheet.calculations[0].result).toEqual(14);
        var calc1 = scope.sheet.calculations[0];

        scope.touchOperator('-');
        scope.touchDigit(9);
        expect(scope.currentCalc.expression).toEqual([calc1, '-']);  // directive should show '14 -'
        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, '-', 9]);
        expect(scope.sheet.calculations[0].result).toEqual(5);

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
        expect(scope.sheet.calculations[0].expression).toEqual([5, '+', 9]);
        expect(scope.sheet.calculations[0].result).toEqual(14);

        scope.touchDigit(0);
        expect(scope.display).toBe('0');
        scope.touchDecimalSeparator();
        expect(scope.display).toBe('0.');
    });


    it('verify behavior with brackets', function () {
        // do not execute $animate.addClass
        spyOn(scope, 'showErrorShake');
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.operatorStr).toBe('');
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.operatorStr).toBe('');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchCloseBracket();
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual(['(' , 5, ')']);

        scope.reset();
        scope.touchOpenBracket();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchCloseBracket();
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual(['(' , '(', 5, ')', ')']);

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        scope.touchCloseBracket();  // skip second operand
        // expect error signal
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual(['(', 5, '+']);
    });


    it('verify behavior with default 0 operand', function () {
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.sheet.calculations[0].expression).toEqual([5, '+', 0]);
        expect(scope.sheet.calculations[0].result).toEqual(5);

        scope.reset();
        scope.touchOperator('+');
        scope.touchDigit(5);
        scope.touchEqualsOperator();
        expect(scope.numberEnteringState).toBeFalsy();
        expect(scope.operatorStr).toBe('');
        expect(scope.display).toBe('5');
        expect(scope.sheet.calculations[0].expression).toEqual([0, '+', 5]);
        expect(scope.sheet.calculations[0].result).toEqual(5);
    });

    it('verify behavior with brackets and equals', function () {
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.sheet.calculations[0].expression).toEqual(['(', 5, '+', 1, ')']);
        expect(scope.sheet.calculations[0].result).toEqual(6);
    });


    it('verify behavior with brackets and selected var', function () {
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        var calc1 = scope.sheet.calculations[0];

        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.processSelectedCalculation(scope.sheet.calculations[0]);
        scope.touchCloseBracket();
        expect(scope.currentCalc.expression).toEqual(['(', 5, '+', calc1, ')']);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('7');
        expect(scope.sheet.calculations[0].expression).toEqual(['(', 5, '+', calc1, ')']);
        expect(scope.sheet.calculations[0].result).toEqual(7);
    });

    it('verify behavior decimal rounding', function () {
        scope.touchDigit(3);
        scope.touchOperator('/');
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('3');
        expect(scope.sheet.calculations[0].result).toEqual(3);

        scope._test_reset();
        scope.touchDigit(1);
        scope.touchOperator('/');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toContain('0.333333333');
        expect(scope.sheet.calculations[0].result).toEqual(1 / 3);
    });

    it('verify two times touch equal = remember', function() {
        spyOn(scope, 'touchRemember');
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(scope.sheet.calculations.length).toBe(0);
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(scope.sheet.calculations.length).toBe(1);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(1);
        expect(scope.sheet.calculations.length).toBe(1);
        // nog een keer
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(2);
        expect(scope.sheet.calculations.length).toBe(1);
    });

    it('verify two times touch equal = remember - repeated', function() {
        spyOn(scope, 'touchRemember');
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(scope.sheet.calculations.length).toBe(0);
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(0);
        expect(scope.sheet.calculations.length).toBe(1);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(1);
        expect(scope.touchRemember.calls.count()).toEqual(1);
        // nog een keer met een ander getal
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(1);
        expect(scope.sheet.calculations.length).toBe(2);
        scope.touchEqualsOperator();
        expect(scope.touchRemember.calls.count()).toEqual(2);
        expect(scope.sheet.calculations.length).toBe(2);
    });

    it('verify edit mode', function() {
        // setup fixture
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].result).toBe(9);
        // go to edit mode
        scope.gotoEditMode(scope.sheet.calculations[0]);
        scope.touchDigit(7);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].result).toBe(7);

        // again with bit more complex expression
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(2);
        // go to edit mode
        scope.gotoEditMode(scope.sheet.calculations[0]);
        scope.touchDigit(4);
        scope.touchOperator('+');
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations.length).toBe(2);
        expect(scope.sheet.calculations[0].result).toBe(8);
        expect(scope.sheet.calculations[1].result).toBe(7);
    });

    it('verify cancel edit mode', function() {
        // setup fixture
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].result).toBe(9);
        // go to edit mode
        scope.gotoEditMode(scope.sheet.calculations[0]);
        scope.touchDigit(7);
        scope.cancelEditMode();
        expect(scope.sheet.calculations[0].result).toBe(9);
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
        scope.gotoEditMode(scope.sheet.calculations[0]); // calc2 in edit mode
        scope.processSelectedCalculation(calc1);  // verwijs naar calc1
        scope.touchEqualsOperator();
        // the equals should reset
        expect(calc2.expression).toEqual([3]);
        expect(calc2.result).toEqual(3);
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
        expect((!scope.currentCalc.expressionEnteringState && scope.sheet.nrOfCalcs() > 0)).toBeTruthy();
        scope.touchOperator('*');
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.display).toEqual('1');
    });


    it('verify check before equals', function() {
        spyOn(scope, 'showErrorShake');
        scope.touchOpenBracket();
        expect(scope.currentCalc.expression).toEqual(['(']);
        scope.touchEqualsOperator();
        expect(scope.currentCalc.expression).toEqual(['(']);
        expect(scope.showErrorShake).toHaveBeenCalled();
    });


    it('verify processFunctionSelected inch-to-centimeters', function() {
        scope.touchDigit(2);
        scope.touchDigit(5);
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations[0].expression.length).toBe(3);
        expect(scope.sheet.calculations[0].result).toBe(25 * 2.54);
        expect(scope.sheet.calculations[1].expression.length).toBe(1);
        expect(scope.sheet.calculations[1].result).toBe(25);
    });

    it('verify processFunctionSelected conversion without intermediate calculation', function() {
        scope.touchDigit(2);
        scope.touchOperator('x');
        scope.touchDigit(5);
        scope.touchEqualsOperator();
        expect(scope.numberEnteringState).toBeFalsy();
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations.length).toBe(2);
        expect(scope.sheet.calculations[0].result).toBe(25.4);
        expect(scope.sheet.calculations[1].result).toBe(10);
    });


    // het huidige gedrag met een 'lege 0' calculatie zou beter moeten, maar voor nu even goed genoeg
    it('verify processFunctionSelected conversion without input', function() {
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();   // vanwege onderstaande digest moeten we dit doen :-(
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations.length).toBe(2);
        var calc0 = scope.sheet.calculations[1];
        expect(calc0.result).toBe(0);
        expect(calc0.expression).toEqual([0]);

        expect(scope.sheet.calculations[0].expression).toEqual([calc0, 'x', 2.54]);
        expect(scope.sheet.calculations[0].result).toBe(0);
    });


    it('verify processFunctionSelected conversion with selected calc', function() {
        scope.touchDigit(5);
        scope.touchPlusMinOperator();
        scope.touchEqualsOperator();
        var calc = scope.sheet.calculations[0];

        scope.reset();
        scope.processSelectedCalculation(calc);
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();   // vanwege onderstaande digest moeten we dit doen :-(
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations.length).toBe(2);
        expect(scope.sheet.calculations[0].expression).toEqual([calc, 'x', 2.54]);
        expect(scope.sheet.calculations[0].result).toBe(-12.7);
        expect(scope.operatorStr).toBe('');
        expect(scope.currentCalc.expression).toEqual([]);
        // verify post state processing
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([1]);
        expect(scope.sheet.calculations[0].result).toBe(1);

    });


    it('verify processFunctionSelected conversion with plus/min operand', function() {
        scope.touchDigit(5);
        scope.touchPlusMinOperator();
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();   // vanwege onderstaande digest moeten we dit doen :-(
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations.length).toBe(2);
        var calc1 = scope.sheet.calculations[1];
        expect(calc1.result).toBe(-5);
        expect(calc1.expression).toEqual(['_', 5]);

        expect(scope.sheet.calculations[0].expression).toEqual([calc1, 'x', 2.54]);
        expect(scope.sheet.calculations[0].result).toBe(-12.7);
    });


    it('verify processFunctionSelected conversion with following plus/min operand', function() {
        scope.touchDigit(5);
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();   // vanwege onderstaande digest moeten we dit doen :-(
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations.length).toBe(2);
        var calc1 = scope.sheet.calculations[1];
        var conversionResultCalc = scope.sheet.calculations[0];
        expect(calc1.result).toBe(5);
        expect(conversionResultCalc.result).toBe(12.7);
        // start the real test
        scope.touchPlusMinOperator();
        scope.touchOperator('+')
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        // verify
        expect(scope.sheet.calculations[0].expression).toEqual(['_', conversionResultCalc, '+', 1]);
        expect(scope.sheet.calculations[0].result).toBe(-11.7);
    });



    it('verify processFunctionSelected conversion with following digit', function() {
        scope.touchDigit(5);
        scope.processFunctionSelected('inch-to-centimeters');
        mockBackEnd();   // vanwege onderstaande digest moeten we dit doen :-(
        scope.$digest(); // needed to trigger the then()
        expect(scope.sheet.calculations.length).toBe(2);
        // start the real test
        scope.touchDigit(1);
        scope.touchEqualsOperator();
        // verify
        expect(scope.sheet.calculations[0].expression).toEqual([1]);
        expect(scope.sheet.calculations[0].result).toBe(1);
    });



    // copied response from console, you need to drop "data:" and the curly brackets
    var responseUSD_EUR = '{"header":{"id":"9b936b3b-4b42-4613-83f4-53d68f98b56c","test":false,"prepared":"2016-10-05T20:41:28.380+02:00","sender":{"id":"ECB"}},"dataSets":[{"action":"Replace","validFrom":"2016-10-05T20:41:28.380+02:00","series":{"0:0:0:0:0":{"attributes":[null,null,0,null,null,null,null,null,null,null,0,null,0,null,0,0,0,0],"observations":{"0":[1.2,0,null,null,null]}}}}],"structure":{"links":[{"title":"Exchange Rates","rel":"dataflow","href":"https://sdw-wsrest.ecb.europa.eu:443null/service/dataflow/ECB/EXR/1.0"}],"name":"Exchange Rates","dimensions":{"series":[{"id":"FREQ","name":"Frequency","values":[{"id":"D","name":"Daily"}]},{"id":"CURRENCY","name":"Currency","values":[{"id":"USD","name":"US dollar"}]},{"id":"CURRENCY_DENOM","name":"Currency denominator","values":[{"id":"EUR","name":"Euro"}]},{"id":"EXR_TYPE","name":"Exchange rate type","values":[{"id":"SP00","name":"Spot"}]},{"id":"EXR_SUFFIX","name":"Series variation - EXR context","values":[{"id":"A","name":"Average"}]}],"observation":[{"id":"TIME_PERIOD","name":"Time period or range","role":"time","values":[{"id":"2016-10-05","name":"2016-10-05","start":"2016-10-05T00:00:00.000+02:00","end":"2016-10-05T23:59:59.999+02:00"}]}]},"attributes":{"series":[{"id":"TIME_FORMAT","name":"Time format code","values":[]},{"id":"BREAKS","name":"Breaks","values":[]},{"id":"COLLECTION","name":"Collection indicator","values":[{"id":"A","name":"Average of observations through period"}]},{"id":"DOM_SER_IDS","name":"Domestic series ids","values":[]},{"id":"PUBL_ECB","name":"Source publication (ECB only)","values":[]},{"id":"PUBL_MU","name":"Source publication (Euro area only)","values":[]},{"id":"PUBL_PUBLIC","name":"Source publication (public)","values":[]},{"id":"UNIT_INDEX_BASE","name":"Unit index base","values":[]},{"id":"COMPILATION","name":"Compilation","values":[]},{"id":"COVERAGE","name":"Coverage","values":[]},{"id":"DECIMALS","name":"Decimals","values":[{"id":"4","name":"Four"}]},{"id":"NAT_TITLE","name":"National language title","values":[]},{"id":"SOURCE_AGENCY","name":"Source agency","values":[{"id":"4F0","name":"European Central Bank (ECB)"}]},{"id":"SOURCE_PUB","name":"Publication source","values":[]},{"id":"TITLE","name":"Title","values":[{"name":"US dollar/Euro"}]},{"id":"TITLE_COMPL","name":"Title complement","values":[{"name":"ECB reference exchange rate, US dollar/Euro, 2:15 pm (C.E.T.)"}]},{"id":"UNIT","name":"Unit","values":[{"id":"USD","name":"US dollar"}]},{"id":"UNIT_MULT","name":"Unit multiplier","values":[{"id":"0","name":"Units"}]}],"observation":[{"id":"OBS_STATUS","name":"Observation status","values":[{"id":"A","name":"Normal value"}]},{"id":"OBS_CONF","name":"Observation confidentiality","values":[]},{"id":"OBS_PRE_BREAK","name":"Pre-break observation value","values":[]},{"id":"OBS_COM","name":"Observation comment","values":[]}]}},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"url":"https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1","headers":{"Accept":"application/vnd.sdmx.data+json;version=1.0.0-cts"}},"statusText":"OK"}';

    it('verify processFunctionSelected euro-to-usd', function() {
        scope.touchDigit(4);
        scope.touchDigit(0);
        var calc = scope.sheet.createNewCalculation();
        scope.processFunctionSelected('eur-to-usd');
        mockBackEnd();
        httpBackend.expectGET('https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1').respond(200, responseUSD_EUR);
        httpBackend.flush();
        expect(scope.sheet.calculations.length).toBe(3);
        expect(scope.sheet.calculations[0].expression.length).toBe(3);
        expect(scope.sheet.calculations[0].result).toBe(40 * 1.2);
        expect(scope.sheet.calculations[1].expression.length).toBe(1);
        expect(scope.sheet.calculations[1].result).toBe(1.2);
        expect(scope.sheet.calculations[2].expression.length).toBe(1);
        expect(scope.sheet.calculations[2].result).toBe(40);
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
    });


    it('verify touchDelete operator', function() {
        scope.touchDigit(3);
        scope.touchOperator('x');
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.display).toBe('3');

        scope.reset();
        scope.touchDigit(3);
        scope.touchOperator('x');
        scope.touchDigit(2);
        scope.touchOperator('+');
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.currentCalc.expression).toEqual([3, 'x']);
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
        expect(scope.currentCalc.expression).toEqual([3, 'x']);
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
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.display).toContain('0.33333');
        scope.touchOperator('x');
        expect(scope.currentCalc.expression).toEqual([calc1, 'x']);
        scope.touchDigit(3);
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual([calc1, 'x', 3]);
        expect(scope.display).toBe('1');
    });


    it('verify touchDelete open bracket', function() {
        // open bracket
        scope.reset();
        scope.touchOpenBracket();
        scope.touchDelete();
        expect(scope.operatorStr).toBe('');
        expect(scope.currentCalc.expression).toEqual([]);
        expect(scope.display).toBe('0');

        scope.reset();
        scope.touchDigit(1);
        scope.touchOperator('+');
        scope.touchOpenBracket();
        scope.touchDelete();
        scope.touchDigit(2);
        scope.touchEqualsOperator();
        expect(scope.operatorStr).toBe('');
        expect(scope.sheet.calculations[0].expression).toEqual([1, '+', 2]);
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
        expect(scope.currentCalc.expression).toEqual(['(', 1, '+']);
        expect(scope.display).toBe('3');
        // we gaan verder met edit
        scope.touchOperator('x');
        scope.touchDigit(4);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.sheet.calculations[0].expression).toEqual(['(', 1, '+', 3, 'x', 4, ')']);
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
        expect(scope.sheet.calculations[0].result).toEqual(18);
    });


    it('verify touchDelete with plusmin', function() {
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
        expect(scope.currentCalc.expression).toEqual([-2, 'x']);
        scope.touchDigit(4);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-8');
        expect(scope.sheet.calculations[0].expression).toEqual([-2, 'x', 4]);
        expect(scope.sheet.calculations[0].result).toEqual(-8);
    });

    it('verify touchDelete extended with plusmin', function() {
        expect(scope.display).toBe('0');
        scope.touchDigit(4);
        scope.touchOperator('x');
        scope.touchPlusMinOperator();
        scope.touchDelete();
        expect(scope.currentCalc.expression).toEqual([4, 'x']);
        scope.touchDigit(6);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('24');
        expect(scope.sheet.calculations[0].expression).toEqual([4, 'x', 6]);
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
        expect(scope.display).toBe('9');
        expect(scope.plusMinusTyped).toBeFalsy();
        expect(scope.operatorStr).toBe('');
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
        expect(scope.currentCalc.expression).toEqual([2, '+']);
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('-');
        expect(scope.plusMinusTyped).toBeTruthy();
        scope.touchDigit(9);
        expect(scope.currentCalc.expression).toEqual([2, '+']);
        expect(scope.display).toBe('-9');
        expect(scope.operatorStr).toBe('');

        // -(
        scope.reset();
        scope.touchPlusMinOperator();
        scope.touchOpenBracket();
        expect(scope.currentCalc.expression).toEqual(['_', '(']);
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual([]);  // leeg!
        expect(scope.operatorStr).toBe('-');
        expect(scope.plusMinusTyped).toBeTruthy();
        scope.touchDelete();
        expect(scope.currentCalc.expression).toEqual([]);
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
        expect(scope.currentCalc.expression).toEqual([5, '+', '_', '(']);
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.plusMinusTyped).toBeTruthy();
        expect(scope.currentCalc.expression).toEqual([5, '+' ]);
        expect(scope.operatorStr).toBe('-');
        scope.touchDelete();
        expect(scope.display).toBe('0');
        expect(scope.currentCalc.expression).toEqual([5, '+' ]);
        expect(scope.operatorStr).toBe('+');
    });

});
