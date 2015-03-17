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
        expect(generateVarName('')).toBe('calc1');
        expect(generateVarName('foo')).toBe('calc1');
        expect(generateVarName('calc1')).toBe('calc2');
        expect(generateVarName('sd124')).toBe('sd125');
        expect(generateVarName('12sd9')).toBe('12sd10');
    });

});

