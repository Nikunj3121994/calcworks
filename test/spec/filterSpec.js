'use strict';


describe('Test filters', function () {

    var $filter;

    beforeEach(function () {
        module('calcworks');

        inject(function (_$filter_, sheetService) {
            $filter = _$filter_;
        });
    });

    it('verify toFixedDecimals filter', function () {
        var toFixedDecimalsFilter = $filter('toFixedDecimals');
        var result = toFixedDecimalsFilter(0);
        expect(result).toBe('0');

        result = toFixedDecimalsFilter(null);
        expect(result).toBe(null);

        result = toFixedDecimalsFilter(1234);
        expect(result).toBe('1,234');

        result = toFixedDecimalsFilter(0.333333);
        expect(result).toBe('0.33');
    });


    it('verify toDate filter', function () {
        var dateFilter = $filter('toDate');
        var today = new Date();
        var result = dateFilter(today);
        expect(result).toContain('today at');

        //var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 1, 1, 0, 0);
        result = dateFilter(yesterday);
        expect(result).toContain('yesterday at');

        var daysAgo = new Date((new Date()).valueOf() - 1000*60*60*24 * 4);
        result = dateFilter(daysAgo);
        expect(result).not.toContain('yesterday');
        expect(result).not.toContain('today');
    });


});
