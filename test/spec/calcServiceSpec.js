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

        var calc2 = new Calculation('xxxx', 'var2', ['var1', '+', 4]);
        calculations.push(calc2);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
    });

    it('verify calcVarname(calculations, varname, outcomes)', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', '3']);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', ['var1', '+', 4]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', ['var2', '+', 1]);
        calculations.push(calc3);
        var state = {};
        state.outcomes = {};
        state.varNamesInCalculation = {};
        calcService.calcVarname(calculations, 'var1', state);
        expect(state.outcomes['var1']).toBe(5);
        calcService.calcVarname(calculations, 'var2', state);
        expect(state.outcomes['var2']).toBe(9);
        calcService.calcVarname(calculations, 'var3', state);
        expect(state.outcomes['var3']).toBe(10);
    });


    it('verify calculate with 2 vars', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', ['var1', '+', 4]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', ['var2', '+', 1]);
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
        var calc2 = new Calculation('xxxx', 'var11', ['var1', '+', 100]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', ['var1', '+', 'var11', '+', 'var1', '+', 'var11']);
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
        var calc2 = new Calculation('xxxx', 'var2', ['var1', '+', 'var1']);
        calculations.push(calc2);
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(10);
    });

    it('verify calculate with 2 vars in random order', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 3]);
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', ['var3', '+', 4]);
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', ['var1', '+', 1]);
        calculations.push(calc3);
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(10);
        expect(calculations[2].result).toBe(6);
    });


    it('verify calculate with error', function () {
        var calc1 = new Calculation('xxxx', 'var1', [2, '+', 'sdf']);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBeNaN();
        // todo: errlog moet naar sheet nivo
        expect(calculations.errorlog.undefinedVariables).toEqual(["\"sdf\" is undefined"]);
    });

    it('verify calculate with circular reference', function () {
        var calc1 = new Calculation('id1', 'var1', [2, '+', 'var1']);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBeNull();
        expect(calculations.errorlog.circularReference).toEqual('Circular reference; "var1" refers to a calculation that refers back to "var1"');

        var calc1 = new Calculation('id1', 'var1', [2, '+', 'var2']);
        var calc2 = new Calculation('id2', 'var2', ['2', '+', 'var1']);
        var calculations = [ calc1, calc2 ];
        var sheet = new Sheet('id','sheet', calculations);
        calcService.calculate(sheet);
        expect(calculations[0].result).toBeNull();
        expect(calculations.errorlog.circularReference).toEqual('Circular reference; "var2" refers to a calculation that refers back to "var2"');
    });


    it('verify renameVar single', function () {
        var calc1 = new Calculation('xx', 'var1', [2, '+',  'var2']);
        var calculations = [ calc1 ];
        calcService.renameVarInExpressions('var2', 'debt', calculations);
        expect(calculations[0].expression).toEqual([2,  '+', 'debt']);

        var calc1 = new Calculation('xx', 'var1', [2, '+', '5']);
        var calc2 = new Calculation('xx', 'var2', [2, '+',  'var1' , '+',  'var1']);
        var calculations = [ calc1, calc2 ];
        calcService.renameVarInExpressions('var1', 'debt', calculations);
        expect(calculations[0].expression).toEqual([2, '+', '5']);
        expect(calculations[1].expression).toEqual([2, '+', 'debt' , '+',  'debt']);
    });


    it('verify renameVar ', function () {
        var calc1 = new Calculation('id1', 'var1', [2, '+',  3]);
        var calculations = [ calc1 ];
        var sheet = new Sheet('id','sheet', calculations);

        calcService.renameVar(calc1, 'foo', sheet);
        expect(sheet.calculations[0].varName).toEqual('foo');

        // reset
        calc1 = new Calculation('id1', 'var1', [2, '+',  3]);
        var calc2 = new Calculation('id2', 'var2', ['var1' , '+',  5]);
        sheet.calculations.push(calc2);
        calcService.renameVar(calc1, 'foo', sheet);
        expect(sheet.calculations[0].expression).toEqual([2, '+',  3]);
        expect(sheet.calculations[1].expression).toEqual(['foo' , '+',  5]);
    });


    it('verify countVarNames', function () {
        var calc1 = new Calculation('id1', 'var1', [2, '+',  'var1']);
        var calculations = [ calc1 ];
        expect(calcService.countVarNames('a', calculations)).toEqual(0);
        expect(calcService.countVarNames('var1', calculations)).toEqual(1);

        var calc2 = new Calculation('xxxx', 'var2', 'var1 , '+',  4');
        calculations.push(calc2);
        expect(calcService.countVarNames('var1', calculations)).toEqual(1);

        calc2.varName = 'var1';
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

