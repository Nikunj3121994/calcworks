'use strict';


//todo: rename this file to calculatorCtrlSpec

describe('Test controller CalculatorCtrl', function () {

    // load the app - included services
    beforeEach(module('calcworks'));


    var CalculatorCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, calcService, sheetService) {
        scope = $rootScope.$new();
        // we need to supply an empty sheet for each test otherwise the activeSheet is not in sync with
        // lastVarname. The (new) test resets lastVarname, but loads results from the previous test.
        // If one day we want to add calculations from a details pane we will have the same problem
        // and need to look up the last handed out var name.
        sheetService.getActiveSheet = function() {
            return new Sheet('foo', []);
        };
        CalculatorCtrl = $controller('CalculatorCtrl', {
          $scope: scope,
          calcService: calcService,
          sheetService: sheetService
        });
    }));


    //// needed for deep equal comparison of objects
    //function replacer(k, v) {
    //    if (touchof v === 'function') {
    //        v = v.toString();
    //    } else if (window['File'] && v instanceof File) {
    //        v = '[File]';
    //    } else if (window['FileList'] && v instanceof FileList) {
    //        v = '[FileList]';
    //    }
    //    return v;
    //}
    //
    //beforeEach(function(){
    //    this.addMatchers({
    //        toBeJsonEqual: function(expected){
    //            var one = JSON.stringify(this.actual, replacer).replace(/(\\t|\\n)/g,''),
    //                two = JSON.stringify(expected, replacer).replace(/(\\t|\\n)/g,'');
    //
    //            return one === two;
    //        }
    //    });
    //});
    //

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

        expect(scope.newNumber).toBe(false);
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('50 +');
        expect(scope.operatorStr).toBe('+');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');
        expect(scope.expression).toBe('50 +');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('59');
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toBe('50 + 9 = 59');

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
        expect(scope.expression).toBe('91 - 93 = -2');
    });


    it('verify touchDelete', function() {
        expect(scope.display).toBe('0');

        scope.touchDigit(3);
        scope.touchDelete('');
        expect(scope.display).toBe('0');

        scope.reset();
        scope.touchDelete('');
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
        expect(scope.expression).toBe('2 +');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');

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

        scope.reset();
        scope.touchDigit(4);
        scope.touchOperator('*');
        scope.touchPlusMinOperator();
        scope.touchDigit(2);
        expect(scope.display).toBe('-2');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('-8');
    });


    it('verify operator touched multiple times', function () {
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toBe('5 +');
        // repeat, should not have effect on display
        scope.touchOperator('+');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toBe('5 +');
        // continue with normal sequence
        scope.touchDigit(3);
        scope.touchOperator('*');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('*');
        expect(scope.expression).toBe('5 + 3 *');
    });


    it('verify start meteen met een operator', function() {
        expect(scope.display).toBe('0');
        scope.touchOperator('*');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
    });


    it('verify display; multiply', function () {
        scope.touchDigit(5);
        expect(scope.display).toBe('5');

        scope.touchOperator('*');
        expect(scope.operatorStr).toBe('*');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('45');
        expect(scope.operatorStr).toBe('');
        expect(scope.expression).toBe('5 * 9 = 45');
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
    });

    it('verify brackets', function() {
        // (4+5)=
        expect(scope.display).toBe('0');
        scope.touchOpenBracket();
        expect(scope.expression).toBe('(');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(4);
        expect(scope.display).toBe('4');
        expect(scope.expression).toBe('(');
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toBe('(4 +');
        expect(scope.display).toBe('0');
        scope.touchDigit(5);
        scope.touchCloseBracket();
        expect(scope.expression).toBe('(4 + 5)');
        expect(scope.operatorStr).toBe('');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.expression).toBe('(4 + 5) = 9');
        expect(scope.operatorStr).toBe('');

        // (4) + 5
        scope.reset();
        scope.calculations = [];
        scope.touchOpenBracket();
        expect(scope.expression).toBe('(');
        expect(scope.display).toBe('0');
        expect(scope.operatorStr).toBe('');
        scope.touchDigit(4);
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('(4)');
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toBe('(4) +');
        scope.touchDigit(5);
        expect(scope.expression).toBe('(4) +');
        expect(scope.operatorStr).toBe('+');
        scope.touchEqualsOperator();
        expect(scope.display).toBe('9');
        expect(scope.expression).toBe('(4) + 5 = 9');
        expect(scope.operatorStr).toBe('');

    });

    it('verify open bracket after expression entered', function() {
        // enter a dummy expression
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        // start with open bracket, this should reset the expression
        scope.touchOpenBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('(');
        expect(scope.operatorStr).toBe('');
    });


    it('verify resolved expression', function () {
        expect(scope.display).toBe('0');

        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(9);
        scope.touchEqualsOperator();
        expect(scope.display).toBe('14');
        expect(scope.expression).toBe('5 + 9 = 14');

        scope.touchOperator('-');
        scope.touchDigit(9);
        expect(scope.expression).toBe('calc1 -');  // directive should show '14 -'
        scope.touchEqualsOperator();
        expect(scope.display).toBe('5');
        expect(scope.expression).toBe('14 - 9 = 5');
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
        expect(scope.expression).toBe('5 + 9 = 14');

        scope.touchDigit(0);
        expect(scope.display).toBe('0');
        scope.touchDecimalSeparator();
        expect(scope.display).toBe('0.');
    });


    it('verify behavior with brackets', function () {
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('');
        expect(scope.operatorStr).toBe('');
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('');
        expect(scope.operatorStr).toBe('');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchCloseBracket();
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('(5)');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchCloseBracket();
        scope.touchCloseBracket();
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('((5))');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        scope.touchCloseBracket();
        // expect error signal
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('(5 +');
    });


    it('verify behavior with equals', function () {
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchEqualsOperator();
        // expect error signal
        expect(scope.display).toBe('0');
        expect(scope.expression).toBe('5 +');

        scope.reset();
        scope.touchOpenBracket();
        scope.touchDigit(5);
        scope.touchOperator('+');
        scope.touchDigit(1);
        scope.touchCloseBracket();
        scope.touchEqualsOperator();
        expect(scope.display).toBe('6');
        expect(scope.expression).toBe('(5 + 1) = 6');

    });


});
