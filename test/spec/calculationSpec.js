'use strict';

describe('Test Calculation object', function () {


    it('verify result', function () {
        var calc = new Calculation('xxxx', "calcName", []);
        expect(calc.result).toBeNull();
        expect(calc.id).toBe('xxxx');
        expect(calc.varName).toBe('calcName');
    });


    it('verify result', function () {
        var calc = new Calculation('xxxx', "calcName", []);
        expect(calc.validName('abc')).toBeTruthy();
        expect(calc.validName('ABc')).toBeTruthy();
        expect(calc.validName('#')).toBeFalsy();
        expect(calc.validName('abc_')).toBeTruthy();
        expect(calc.validName('abc1')).toBeTruthy();
        expect(calc.validName('abc12')).toBeTruthy();
    });


    //it('parse vars', function() {
    //    var calc = new Calculation('xxxx', "calcName", '');
    //    expect(calc.parseVarsExpression()).toEqual([]);
    //    calc.expression = ' 4 ';
    //    expect(calc.parseVarsExpression()).toEqual([]);
    //    calc.expression = 'abc';
    //    expect(calc.parseVarsExpression()).toEqual(['abc']);
    //    calc.expression = ' abc ';
    //    expect(calc.parseVarsExpression()).toEqual(['abc']);
    //    calc.expression = ' abc_ ';
    //    expect(calc.parseVarsExpression()).toEqual(['abc_']);
    //    calc.expression = ' abc dfg ';
    //    expect(calc.parseVarsExpression()).toEqual(['abc', 'dfg']);
    //    calc.expression = ' abc dfg 12';
    //    expect(calc.parseVarsExpression()).toEqual(['abc', 'dfg']);
    //    calc.expression = ' abc dfg + 12 ';
    //    expect(calc.parseVarsExpression()).toEqual(['abc', 'dfg']);
    //    calc.expression = ' abc12 dfg + 12';
    //    expect(calc.parseVarsExpression()).toEqual(['abc12', 'dfg']);
    //    calc.expression = ' aBc12 Dfg23 + 12';
    //    expect(calc.parseVarsExpression()).toEqual(['aBc12', 'Dfg23']);
    //    calc.expression = ' aBc12 Dfg23+12';
    //    expect(calc.parseVarsExpression()).toEqual(['aBc12', 'Dfg23']);
    //    calc.expression = ' aBc12 + aBc12 + 12';
    //    expect(calc.parseVarsExpression()).toEqual(['aBc12']);
    //})


});

