'use strict';

describe('Controller: CalculatorCtrl', function () {

    // load the app - included services
    beforeEach(module('calcworks'));


    var CalculatorCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, calcService) {
        scope = $rootScope.$new();
            //// override the UUID method to always return the same result
            //calcService.generateUUID = function() {
            //    return 'xxxx';
            //}
        CalculatorCtrl = $controller('CalculatorCtrl', {
          $scope: scope
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

    it('verify plus, min, reset', function () {

        expect(scope.display).toBe('0');

        // plus operation
        scope.touchDigit(5);
        expect(scope.display).toBe('5');

        scope.touchDigit(0);
        expect(scope.display).toBe('50');

        expect(scope.newNumber).toBe(false);
        scope.touchOperator('+');
        expect(scope.display).toBe('0');  // still under discussion
        //expect(scope.display).toBe('50');
        expect(scope.expression).toBe('50 +');
        expect(scope.operatorStr).toBe('+');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');
        expect(scope.expression).toBe('50 +');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('59');
        expect(scope.operatorStr).toBe('');

        scope.reset();

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
    });


    it('verify display; multiply', function () {

        expect(scope.display).toBe('0');

        scope.touchDigit(0);
        expect(scope.display).toBe('0');

        scope.touchDigit(5);
        expect(scope.display).toBe('5');

        scope.touchOperator('*');
        //expect(scope.display).toBe('5');
        expect(scope.operatorStr).toBe('*');

        scope.touchDigit(9);
        expect(scope.display).toBe('9');

        scope.touchEqualsOperator();
        expect(scope.display).toBe('45');
        expect(scope.operatorStr).toBe('');
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
        expect(scope.operatorStr).toBe('(');
        scope.touchDigit(4);
        expect(scope.display).toBe('4');
        expect(scope.expression).toBe('(');
        scope.touchOperator('+');
        expect(scope.operatorStr).toBe('+');
        expect(scope.expression).toBe('(4 +');
        expect(scope.display).toBe('0');
//        expect(scope.display).toBe('4');  under discussion
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
        expect(scope.operatorStr).toBe('(');
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


});
