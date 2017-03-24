'use strict';

describe('Test Expression Utilities', function () {


    it('addSpaceIfNeeded', function () {
        var string;
        expect(addSpaceIfNeeded(string)).toBe('');

        expect(addSpaceIfNeeded('')).toBe('');
        expect(addSpaceIfNeeded('d ')).toBe('d ');

        expect(addSpaceIfNeeded('(')).toBe('(');

        expect(addSpaceIfNeeded('(4 + 5)')).toBe('(4 + 5) ');

    });

    it('convertNumberForDisplay', function() {
        expect(convertNumberForDisplay('123')).toEqual('123');
        expect(convertNumberForDisplay('123.4567')).toEqual('123.4567');
        expect(convertNumberForDisplay('123456789')).toEqual('123,456,789');
        expect(convertNumberForDisplay('123456789.01')).toEqual('123,456,789.01');

        decimalSeparatorChar = ',';
        thousandsSeparatorChar = '.';

        expect(convertNumberForDisplay('123456789.01')).toEqual('123.456.789,01');
        expect(convertNumberForDisplay('12345678912345')).toEqual('12.345.678.912.345');

        // reset
        decimalSeparatorChar = '.';
        thousandsSeparatorChar = ',';

    });

    it('generateVarName', function () {
        expect(generateCalcName('')).toBe('calc1');
        expect(generateCalcName('foo')).toBe('calc1');
        expect(generateCalcName('calc1')).toBe('calc2');
        expect(generateCalcName('sd124')).toBe('sd125');
        expect(generateCalcName('12sd9')).toBe('12sd10');
    });

    it('isValidObjectName', function () {
        expect(isValidObjectName('abc')).toBe(true);
        expect(isValidObjectName('x')).toBe(true);
        expect(isValidObjectName('5')).toBe(false);
        expect(isValidObjectName(0)).toBe(false);
        expect(isValidObjectName(5)).toBe(false);
        expect(isValidObjectName('1bc')).toBe(false);
        expect(isValidObjectName('=')).toBe(false);
        expect(isValidObjectName('')).toBe(false);
        expect(isValidObjectName(' =')).toBe(false);

        // we allow for max 20 chars to prevent screen clipping, e.g.
        //  'interest per month'
        //   12345678901234567890
        expect(isValidObjectName('a2345678901234567890')).toBe(true);
        expect(isValidObjectName('a23456789012345678901')).toBe(false);
    });

    //
    it('countOccurencesInExpression', function () {
        expect(countOccurencesInExpression('abc', ['abc'])).toEqual(1);
        expect(countOccurencesInExpression('abc', ['123'])).toEqual(0);
        expect(countOccurencesInExpression('abc', [])).toEqual(0);
        expect(countOccurencesInExpression('abc', ['abc', 'def'])).toEqual(1);
        expect(countOccurencesInExpression('abc', ['abc', 'abc'])).toEqual(2);
        expect(countOccurencesInExpression('abc', ['ac', 'abc'])).toEqual(1);
    });

    //
    it('convertNumberForRendering', function () {
        expect(convertNumberForRendering(123)).toEqual('123');
        expect(convertNumberForRendering(123, null)).toEqual('123');
        expect(convertNumberForRendering(123, {})).toEqual('123');
        expect(convertNumberForRendering(123, {minimumFractionDigits : null})).toEqual('123');
        expect(convertNumberForRendering(1 / 3, {minimumFractionDigits : 2})).toEqual('0.33');
        expect(convertNumberForRendering(1 / 3, {minimumFractionDigits : null})).toEqual('0.33');
        expect(convertNumberForRendering('abc')).toEqual('error');
        expect(convertNumberForRendering('abc', {minimumFractionDigits : 2})).toEqual('error');
        expect(convertNumberForRendering(1 / 0)).toEqual('error');
        expect(convertNumberForRendering(1 / 0, {minimumFractionDigits : 2})).toEqual('error');
        expect(convertNumberForRendering(1234)).toEqual('1,234');
        expect(convertNumberForRendering(1234, {})).toEqual('1,234');
        expect(convertNumberForRendering(1234, {minimumFractionDigits : 2})).toEqual('1,234.00');
        expect(convertNumberForRendering(1234567)).toEqual('1,234,567');
        expect(convertNumberForRendering(1234567, {minimumFractionDigits : 2})).toEqual('1,234,567.00');
        expect(convertNumberForRendering(1234567.1)).toEqual('1,234,567.1');
        expect(convertNumberForRendering(1234567.1, {minimumFractionDigits : 2})).toEqual('1,234,567.10');
        expect(convertNumberForRendering(1234567.34)).toEqual('1,234,567.34');
        expect(convertNumberForRendering(1234567.34, {minimumFractionDigits : 2})).toEqual('1,234,567.34');
    });


    it('convertNumberToAmountStr', function() {
        expect(convertNumberToAmountStr(123)).toEqual('123.00');
        expect(convertNumberToAmountStr(123456789)).toEqual('123,456,789.00');
        expect(convertNumberToAmountStr(9.5)).toEqual('9.50');
        expect(convertNumberToAmountStr(9.01)).toEqual('9.01');
        expect(convertNumberToAmountStr(13.25)).toEqual('13.25');
        expect(convertNumberToAmountStr(9.013)).toEqual('9.01');
        expect(convertNumberToAmountStr(9.003)).toEqual('9.00');

        decimalSeparatorChar = ',';
        thousandsSeparatorChar = '.';

        expect(convertNumberToAmountStr(9)).toEqual('9,00');

        // we cannot test and do not need to test the scenarios below because in these scenarios
        // localeString will set the decimal separator
        // expect(convertNumberToAmountStr(9.01)).toEqual('9,01');
        // expect(convertNumberToAmountStr(5.1)).toEqual('5,10');

        // reset
        decimalSeparatorChar = '.';
        thousandsSeparatorChar = ',';

    });


    it('getExprItemForRendering', function() {
        expect(getExprItemForRendering(1)).toEqual('1');
        expect(getExprItemForRendering(0)).toEqual('0');
        expect(getExprItemForRendering('(')).toEqual('(');
        expect(getExprItemForRendering('x')).toEqual('x');
        expect(getExprItemForRendering('_')).toEqual('-');
        var calc = new Calculation('id', 'name', '1 + 2');
        calc.result = 3;
        expect(getExprItemForRendering(calc, null, false)).toEqual('3');
        expect(getExprItemForRendering(calc, null, true)).toEqual('name');
    });

    it('calcDayBeforeAtMidnight', function() {
        var day = new Date(2015, 3, 14, 5, 6, 7, 0);
        var yesterday = calcDayBeforeAtMidnight(day);
        expect(yesterday.getFullYear()).toEqual(2015);
        expect(yesterday.getMonth()).toEqual(3);
        expect(yesterday.getDate()).toEqual(13);
        expect(yesterday.getHours()).toEqual(0);
        expect(yesterday.getMinutes()).toEqual(0);

        day = new Date(2015, 2, 1, 5, 6, 7, 0);
        yesterday = calcDayBeforeAtMidnight(day);
        expect(yesterday.getFullYear()).toEqual(2015);
        expect(yesterday.getMonth()).toEqual(1);
        expect(yesterday.getDate()).toEqual(28);

    })


    it('getNameOfMonth', function() {
        expect(getNameOfMonth(0)).toEqual('January');
    });

});

