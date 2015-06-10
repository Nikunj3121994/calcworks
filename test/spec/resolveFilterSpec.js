'use strict';


describe('Test filter resolve in CalculatorCtrl', function () {

    var $filter;

    beforeEach(function () {
        module('calcworks');

        inject(function (_$filter_, sheetService) {
            $filter = _$filter_;
            sheetService.getActiveSheet = function() {
                var sheet = new Sheet('id', 'foo', []);
                var calc1 = new Calculation('id', 'calc1', [5, '*', 3]);
                calc1.result = 15;
                sheet.add(calc1);
                var calc2 = new Calculation('id', 'calc2', [6, '+', 2]);
                calc2.result = 8;
                sheet.add(calc2);
                var calc3 = new Calculation('id', 'calc3', [1, '/', 3]);
                calc3.result = 1 / 3;
                sheet.add(calc3);
                return sheet;
            };
        });


    });

    it('verify resolve filter', function () {
        var resolveFilter = $filter('resolve');
        var result = resolveFilter([5]);
        expect(result).toBe('5');

        result = resolveFilter([0]);
        expect(result).toBe('0');

        result = resolveFilter([5, '*', 'calc1']);
        expect(result).toBe('5 * 15');

        result = resolveFilter([5, '*', 'calc2']);
        expect(result).toBe('5 * 8');

        result = resolveFilter(['calc1', '*', 'calc2']);
        expect(result).toBe('15 * 8');

        result = resolveFilter([3, '*', 'calc3']);
        expect(result).toBe('3 * 0.33');
    });


});
