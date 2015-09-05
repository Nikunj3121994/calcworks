'use strict';

describe('Test calcService', function () {

    var $log;

    beforeEach(module('calcworks'));

    var calcService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_calcService_, _$log_) {
        calcService = _calcService_;
        $log = _$log_;
    }));

    // Log debug messages in Karma
    afterEach(function(){
        console.log($log.log.logs);
    });


    it('verify replaceMultiplyPercentageOperators', function() {
        expect(calcService.replaceMultiplyPercentageOperators('a % b')).toBe('a / 100 * b');
        expect(calcService.replaceMultiplyPercentageOperators('a x b')).toBe('a * b');
    });

    it('verify calculate without vars', function() {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);

        var calc2 = new Calculation('xxxx', 'var2', [4, '+', 5]);
        calculations.push(calc2);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
    });

    it('verify calculate multiply', function() {
        var calc1 = new Calculation('xxxx', 'var1', [10, 'x', 3, 'x', 2]);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(60);
    });


    it('verify calculate percentage', function() {
        var calc1 = new Calculation('xxxx', 'var1', [600, '%', 3]);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(18);
    });

    it('verify calculate with 1 var', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);

        var calc2 = new Calculation('xxxx', 'var2', [calc1, '+', 4]);
        calculations.push(calc2);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
    });

    it('verify calcVarname(calculations, varname, outcomes)', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', '3']);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', [calc1, '+', 4]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', [calc2, '+', 1]);
        calculations.push(calc3);
        var state = {};
        state.varNamesInCalculation = {};
        calcService.calcCalculation(calculations, calc1, state);
        expect(calc1.result).toBe(5);
        calcService.calcCalculation(calculations, calc2, state);
        expect(calc2.result).toBe(9);
        calcService.calcCalculation(calculations, calc3, state);
        expect(calc3.result).toBe(10);
    });


    it('verify calculate with 2 vars', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', [calc1, '+', 4]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', [calc2, '+', 1]);
        calculations.push(calc3);
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
        expect(calculations[2].result).toBe(10);
    });


 it('verify calculate with 2 vars overlapping in name', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', [calc1, '+', 100]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', [calc1, '+', calc2, '+', calc1, '+', calc2]);
        calculations.push(calc3);
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(105);
        expect(calculations[2].result).toBe(220);
    });

    it('verify calculate with 2 identical vars', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', [calc1, '+', calc1]);
        calculations.push(calc2);
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(10);
    });

    it('verify calculate with 2 vars in random order', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', []);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', [calc1, '+', 1]);
        calc2.expression = [calc3, '+', 4];
        calculations.push(calc3);
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(10);
        expect(calculations[2].result).toBe(6);
    });

    //  zover ik nu kan zien, kan dit zich niet meer voordoen met de Calculatie direct in de expressie
    //it('verify calculate with error', function () {
    //    var calc1 = new Calculation('xxxx', 'var1', [2, '+', 'sdf']);
    //    var calculations = [ calc1 ];
    //    var sheet = new Sheet('id','sheet', calculations);
    //    calcService.calculate(sheet);
    //    expect(calculations[0].result).toBeNaN();
    //    // todo: errlog moet naar sheet nivo
    //    expect(calculations.errorlog.undefinedVariables).toEqual(["\"sdf\" is undefined"]);
    //});

    it('verify calculate with circular reference', function () {
        var calc1 = new Calculation('id1', 'var1', [2, '+']);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calc1.expression.push(calc1);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBeNull();
        expect(calculations.errorlog.circularReference).toEqual('Circular reference; "var1" refers to a calculation that refers back to itself');

        calc1 = new Calculation('id1', 'var1', [2, '+']);
        var calc2 = new Calculation('id2', 'var2', ['2', '+', calc1]);
        calc1.expression.push(calc2);
        calculations = [ calc1, calc2 ];
        sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBeNull();
        expect(calculations.errorlog.circularReference).toEqual('Circular reference; "var1" refers to a calculation that refers back to itself');
    });


    it('verify countVarNames', function () {
        var calc1 = new Calculation('id1', 'var1', [2, '+',  calc1]);
        var calculations = [ calc1 ];
        expect(calcService.countVarNames('a', calculations)).toEqual(0);
        expect(calcService.countVarNames('var1', calculations)).toEqual(1);

        var calc2 = new Calculation('xxxx', 'var2', 'var1 , '+',  4');
        calculations.push(calc2);
        expect(calcService.countVarNames('var1', calculations)).toEqual(1);

        calc2.name = 'var1';
        expect(calcService.countVarNames('var1', calculations)).toEqual(2);
    });


    it('verify sum', function () {
        var calculations = [];
        var sheet = new Sheet('id','sheet', calculations);
        expect(sheet.sum).toBeUndefined();

        calcService.calculate(sheet)
        expect(sheet.sum).toEqual(0);

        var calc1 = new Calculation('id1', 'var1', [2, '+',  5]);
        calculations.push(calc1);
        calcService.calculate(sheet)
        expect(sheet.sum).toEqual(7);

        var calc2 = new Calculation('id2', 'var2', [3]);
        calculations.push(calc2);
        calcService.calculate(sheet)
        expect(sheet.sum).toEqual(10);

    });







});

