'use strict';

describe('Test sheet', function () {

    it('verify getLastNumberFromVarName', function () {
        var sheet = new Sheet('id', 'foo', []);
        expect(0).toEqual(sheet.getLastNumberFromVarName());

        sheet = new Sheet('id', 'foo', [ new Calculation('foo-id', 'bar', 'expr')]);
        expect(0).toEqual(sheet.getLastNumberFromVarName());

        sheet = new Sheet('id', 'foo', [ new Calculation('foo-id', 'bar2', 'expr')]);
        expect(2).toBe(sheet.getLastNumberFromVarName());

        sheet.add(new Calculation('foobie', 'bar5', 'expre'));
        expect(5).toBe(sheet.getLastNumberFromVarName());

    });

});


