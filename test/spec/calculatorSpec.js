'use strict';

describe('Controller: CalculatorCtrl', function () {

    // load the controller's module
    beforeEach(module('calcworks.controllers'));

    var CalculatorCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
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
    //    if (typeof v === 'function') {
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
    });


    it('verify typeDelete', function() {
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

        //scope.reset();
        //scope.typeDigit(2);
        //scope.typeOperator('+');
        //scope.typeDigit(6);
        //scope.typeDelete();
        //scope.typeDigit(4);
        //expect(scope.expression).toBe('2 +');
        //scope.typeIsOperator();
        //expect(scope.calculations[0]).toBeJsonEqual({ id: 'xxxx', varName : 'calc1', expression : '2 + 4', result: 6 });
        //expect(scope.display).toBe('6');

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

        //scope.reset();
        //scope.touchDigit(4);
        //scope.touchOperator('*');
        //scope.touchDigit(2);
        //scope.touchPlusMinOperator();
        //expect(scope.display).toBe('-2');
        //scope.touchIsOperator();
        //expect(scope.display).toBe('-8');
        //
        //scope.reset();
        //scope.touchDigit(4);
        //scope.touchOperator('*');
        //scope.touchPlusMinOperator();
        //scope.touchDigit(2);
        //expect(scope.display).toBe('-2');
        //scope.touchIsOperator();
        //expect(scope.display).toBe('-8');
    });

    it('verify plus, min, reset', function () {

        expect(scope.display).toBe('0');

        // plus operation
        scope.typeDigit(5);
        expect(scope.display).toBe('5');

        scope.typeDigit(0);
        expect(scope.display).toBe('50');

        expect(scope.newNumber).toBe(false);
        scope.typeOperator('+');
        expect(scope.display).toBe('0');  // still under discussion
        //expect(scope.display).toBe('50');
        expect(scope.expression).toBe('50 +');
        expect(scope.operatorStr).toBe('+');

        scope.typeDigit(9);
        expect(scope.display).toBe('9');
        expect(scope.expression).toBe('50 +');

        scope.typeIsOperator();
        expect(scope.display).toBe('59');
        expect(scope.operatorStr).toBe('');

        scope.reset();

        // min operation
        scope.typeDigit(9);
        scope.typeDigit(1);
        scope.typeOperator('-');
        expect(scope.operatorStr).toBe('-');
        scope.typeDigit(9);
        scope.typeDigit(3);
        scope.typeIsOperator();
        expect(scope.display).toBe('-2');
        expect(scope.operatorStr).toBe('');
    });




});
