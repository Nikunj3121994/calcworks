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
    });



});
