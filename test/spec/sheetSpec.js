'use strict';

describe('Test sheet', function () {

    it('verify getLastNumberFromCalcName', function () {
        var sheet = new Sheet('id', 'foo', []);
        expect(0).toEqual(sheet.getLastNumberFromCalcName());

        sheet = new Sheet('id', 'foo', [ new Calculation('foo-id', 'bar', 'expr')]);
        expect(0).toEqual(sheet.getLastNumberFromCalcName());

        sheet = new Sheet('id', 'foo', [ new Calculation('foo-id', 'bar2', 'expr')]);
        expect(2).toBe(sheet.getLastNumberFromCalcName());

        sheet.addCalculation(new Calculation('foobie', 'bar5', 'expre'));
        expect(5).toBe(sheet.getLastNumberFromCalcName());

    });

    it('verify createNewCalculation', function(){
        var sheet = new Sheet('id', 'foo', []);
        var calc = sheet.createNewCalculation();
        expect(calc.name).toBe('calc1');
        var calc = sheet.createNewCalculation('a name');
        expect(calc.name).toBe('a name');
    });

    it('verify getValueFor', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', []);
        calc1.result = 15;
        sheet.addCalculation(calc1);
        expect(15).toEqual(sheet.getValueFor('calc1'));

        var calc2 = new Calculation('id', 'calc2', []);
        calc2.result = 8;
        sheet.addCalculation(calc2);
        expect(8).toEqual(sheet.getValueFor('calc2'));

        expect( function(){ sheet.getValueFor('calc5'); } ).toThrow(new Error('Calculation name "calc5" not found'));

        var sheet = new Sheet('id', 'foo', []);
        expect( function(){ sheet.getValueFor('foo'); } ).toThrow(new Error('Calculation name "foo" not found'));
    });


    it('verify searchCalculation', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', []);
        sheet.addCalculation(calc1);
        expect(sheet.searchCalculation('calc1')).toEqual(calc1);
        expect(sheet.searchCalculation('calcdsfsd')).toBeNull;
    });


    it('verify getCalculationFor', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', []);
        calc1.result = 15;
        sheet.addCalculation(calc1);
        expect(calc1).toEqual(sheet.getCalculationFor('calc1'));

        var calc2 = new Calculation('id', 'calc2', []);
        calc2.result = 8;
        sheet.addCalculation(calc2);
        expect(calc2).toEqual(sheet.getCalculationFor('calc2'));

        expect( function(){ sheet.getCalculationFor('calc5'); } ).toThrow(new Error('Calculation name "calc5" not found'));

        var sheet = new Sheet('id', 'foo', []);
        expect( function(){ sheet.getCalculationFor('foo'); } ).toThrow(new Error('Calculation name "foo" not found'));
    });


    it('verify deleteCalculation', function() {
        var sheet = new Sheet('id', 'foo', []);
        expect( function(){ sheet.deleteCalculation(0); } ).toThrow(new Error('Illegal argument, index: 0'));

        var calc1 = new Calculation('id', 'calc1', [5, 'x', 3]);
        calc1.result = 15;
        sheet.addCalculation(calc1);
        sheet.deleteCalculation(0);
        expect(sheet.calculations.length).toEqual(0);

        var calc2 = new Calculation('id', 'calc2', [calc1, '+', 2]);
        sheet.addCalculation(calc1);
        sheet.addCalculation(calc2);
        sheet.deleteCalculation(1); // dit is calc1
        expect(sheet.calculations.length).toEqual(1);
        expect(sheet.calculations[0].expression).toEqual([15, '+', 2]);

        sheet = new Sheet('id', 'foo', []);
        calc2 = new Calculation('id', 'calc2', [calc1, '+', calc1]);
        sheet.addCalculation(calc2);
        sheet.addCalculation(calc1);
        sheet.deleteCalculation(0); // dit is calc1
        expect(sheet.calculations.length).toEqual(1);
        expect(sheet.calculations[0].expression).toEqual([15, '+', 15]);

        sheet = new Sheet('id', 'foo', []);
        var calc3 = new Calculation('id', 'calc3', [calc1, '+', calc2]);
        sheet.addCalculation(calc3);
        sheet.addCalculation(calc2);
        sheet.addCalculation(calc1);
        sheet.deleteCalculation(0); // dit is calc1
        expect(sheet.calculations.length).toEqual(2);
        expect(sheet.calculations[0].expression).toEqual([15, '+', 15]);
        expect(sheet.calculations[1].expression).toEqual([15, '+', calc2]);
    });

    it('verify deleteCalculation input/output calculations', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', []);
        sheet.addCalculation(calc1);
        var calc2 = new Calculation('id', 'calc2', []);
        sheet.addCalculation(calc2);
        sheet.inputCalculation = calc1;
        sheet.outputCalculation = calc2;

        sheet.deleteCalculation(0); // calc2
        expect(sheet.outputCalculation).toBeUndefined();
        sheet.deleteCalculation(0); // calc1
        expect(sheet.inputCalculation).toBeUndefined();

    });

});


