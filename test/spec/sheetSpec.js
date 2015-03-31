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

    it('verify getValueFor', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', '5 * 3');
        calc1.result = 15;
        sheet.add(calc1);
        expect(15).toEqual(sheet.getValueFor('calc1'));

        var calc2 = new Calculation('id', 'calc2', '6 + 2');
        calc2.result = 8;
        sheet.add(calc2);
        expect(8).toEqual(sheet.getValueFor('calc2'));

        expect( function(){ sheet.getValueFor('calc5'); } ).toThrow(new Error('Calculation name "calc5" not found'));

        var sheet = new Sheet('id', 'foo', []);
        expect( function(){ sheet.getValueFor('foo'); } ).toThrow(new Error('Calculation name "foo" not found'));

    });

});


