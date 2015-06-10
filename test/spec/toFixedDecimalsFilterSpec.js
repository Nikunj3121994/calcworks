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
        expect(result).toBe('1234');

        result = toFixedDecimalsFilter(0.333333);
        expect(result).toBe('0.33');
    });


});
