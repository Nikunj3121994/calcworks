'use strict';

describe('Test Calculation object', function () {


    it('verify result', function () {
        var calc = new Calculation('xxxx', "calcName", []);
        expect(calc.result).toBeNull();
        expect(calc.id).toBe('xxxx');
        expect(calc.name).toBe('calcName');
        expect(calc.createdTimestamp).toBeDefined();
    });

});

