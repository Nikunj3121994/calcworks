'use strict';

describe('Test Expression Utilities', function () {


    it('verify addSpaceIfNeeded', function () {
        var string;
        expect(addSpaceIfNeeded(string)).toBe('');

        expect(addSpaceIfNeeded('')).toBe('');
        expect(addSpaceIfNeeded('d ')).toBe('d ');

        expect(addSpaceIfNeeded('(')).toBe('(');

        expect(addSpaceIfNeeded('(4 + 5)')).toBe('(4 + 5) ');

    });

    it('verify getDecimalSeparator', function () {
        expect(getDecimalSeparator()).toBe('.');
    });

    it('verify generateVarName', function () {
        expect(generateCalcName('')).toBe('calc1');
        expect(generateCalcName('foo')).toBe('calc1');
        expect(generateCalcName('calc1')).toBe('calc2');
        expect(generateCalcName('sd124')).toBe('sd125');
        expect(generateCalcName('12sd9')).toBe('12sd10');
    });

    it('verify isValidObjectName', function () {
        expect(isValidObjectName('abc')).toBe(true);
        expect(isValidObjectName('x')).toBe(true);
        expect(isValidObjectName('5')).toBe(false);
        expect(isValidObjectName(0)).toBe(false);
        expect(isValidObjectName(5)).toBe(false);
        expect(isValidObjectName('1bc')).toBe(false);
        expect(isValidObjectName('=')).toBe(false);
        expect( function(){ isValidObjectName('');  } ).toThrow(new Error("empty argument"));
        expect( function(){ isValidObjectName(' ');  } ).toThrow(new Error("empty argument"));
    });

    //
    it('verify countOccurencesInExpression', function () {
        expect(countOccurencesInExpression('abc', ['abc'])).toEqual(1);
        expect(countOccurencesInExpression('abc', ['123'])).toEqual(0);
        expect(countOccurencesInExpression('abc', [])).toEqual(0);
        expect(countOccurencesInExpression('abc', ['abc', 'def'])).toEqual(1);
        expect(countOccurencesInExpression('abc', ['abc', 'abc'])).toEqual(2);
        expect(countOccurencesInExpression('abc', ['ac', 'abc'])).toEqual(1);
    });

    //
    it('verify convertNumberToDisplay', function () {
        expect(convertNumberToDisplay(123, 2)).toEqual('123');
        expect(convertNumberToDisplay(123, 0)).toEqual('123');
        expect(convertNumberToDisplay(1 / 3, 2)).toEqual('0.33');
        expect(convertNumberToDisplay(1 / 3, 3)).toEqual('0.333');
        expect(convertNumberToDisplay('abc', 2)).toEqual('error');
        expect(convertNumberToDisplay(1 / 0, 2)).toEqual('error');
    });

    it('getExprItemAsString', function() {
        expect(getExprItemAsString(1), null, 1).toEqual('1');
        expect(getExprItemAsString('('), null, 1).toEqual('(');
        expect(getExprItemAsString('x'), null, 1).toEqual('x');
    });



});

