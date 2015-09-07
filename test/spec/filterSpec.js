'use strict';


describe('Test filter toFixedDecimals in CalculatorCtrl', function () {

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
        var result = dateFilter(new Date());
        expect(result).toContain('today at');

        var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
        result = dateFilter(yesterday);
        expect(result).toContain('yesterday at');
    });


});
