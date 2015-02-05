'use strict';

describe('Test calcService', function () {

    beforeEach(module('calcworks'));

    var calcService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_calcService_) {
        calcService = _calcService_;
    }));

    it('verify calculate without vars', function() {
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);

        var calc2 = new Calculation('xxxx', 'var2', '4 + 5');
        calculations.push(calc2);
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
    });

    it('verify calculate with 1 var', function () {
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);

        var calc2 = new Calculation('xxxx', 'var2', 'var1 + 4');
        calculations.push(calc2);
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
    });

    it('verify calcVarname(calculations, varname, outcomes)', function () {
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', 'var1 + 4');
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', 'var2 + 1');
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
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', 'var1 + 4');
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', 'var2 + 1');
        calculations.push(calc3);
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(9);
        expect(calculations[2].result).toBe(10);
    });


 it('verify calculate with 2 vars overlapping in name', function () {
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var11', 'var1 + 100');
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', 'var1 + var11 + var1 + var11');
        calculations.push(calc3);
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(105);
        expect(calculations[2].result).toBe(220);
    });

    it('verify calculate with 2 identical vars', function () {
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', 'var1 + var1');
        calculations.push(calc2);
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(10);
    });

    it('verify calculate with 2 vars in random order', function () {
        var calc1 = new Calculation('xxxx', 'var1', '2 + 3');
        var calculations = [ calc1 ];
        var calc2 = new Calculation('xxxx', 'var2', 'var3 + 4');
        calculations.push(calc2);
        var calc3 = new Calculation('xxxx', 'var3', 'var1 + 1');
        calculations.push(calc3);
        calcService.calculate(calculations);
        expect(calculations[0].result).toBe(5);
        expect(calculations[1].result).toBe(10);
        expect(calculations[2].result).toBe(6);
    });


    it('verify calculate with error', function () {
        var calc1 = new Calculation('xxxx', 'var1', '2 + sdf');
        var calculations = [ calc1 ];
        calcService.calculate(calculations);
        expect(calculations[0].result).toBeNaN();
        expect(calculations.errorlog.undefinedVariables).toEqual(["\"sdf\" is undefined"]);
    });

    it('verify calculate with circular reference', function () {
        var calc1 = new Calculation('id1', 'var1', '2 + var1');
        var calculations = [ calc1 ];
        calcService.calculate(calculations);
        expect(calculations[0].result).toBeNull();
        expect(calculations.errorlog.circularReference).toEqual('Circular reference; variable "var1" refers to a variable that refers back to "var1"');

        var calc1 = new Calculation('id1', 'var1', '2 + var2');
        var calc2 = new Calculation('id2', 'var2', '2 + var1');
        var calculations = [ calc1, calc2 ];
        calcService.calculate(calculations);
        expect(calculations[0].result).toBeNull();
        expect(calculations.errorlog.circularReference).toEqual('Circular reference; variable "var2" refers to a variable that refers back to "var2"');
    });


    it('verify replaceAll', function () {
        expect('2 + debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 + var2'));
        // multiple occurrences
        expect('2 + debt + debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 + var2 + var2'));
        // whole words only
        expect('2 + var22').toEqual(calcService.replaceAllVars('var2', 'debt', '2 + var22'));
        expect('2 + 1var2').toEqual(calcService.replaceAllVars('var2', 'debt', '2 + 1var2'));
        expect('2 +1var2').toEqual(calcService.replaceAllVars('var2', 'debt', '2 +1var2'));

        expect('2 +debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 +var2'));
        expect('2 -debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 -var2'));
        expect('2 *debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 *var2'));
        expect('2 /debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 /var2'));
        expect('2 %debt').toEqual(calcService.replaceAllVars('var2', 'debt', '2 %var2'));

        expect('2 +debt ').toEqual(calcService.replaceAllVars('var2', 'debt', '2 +var2 '));
    });


    it('verify renameVar single', function () {
        var calc1 = new Calculation('xx', 'var1', '2 + var2');
        var calculations = [ calc1 ];
        calcService.renameVarInExpressions('var2', 'debt', calculations);
        expect(calculations[0].expression).toEqual('2 + debt');

        var calc1 = new Calculation('xx', 'var1', '2 + 5');
        var calc2 = new Calculation('xx', 'var2', '2 + var1 + var1');
        var calculations = [ calc1, calc2 ];
        calcService.renameVarInExpressions('var1', 'debt', calculations);
        expect(calculations[0].expression).toEqual('2 + 5');
        expect(calculations[1].expression).toEqual('2 + debt + debt');
    });

    it('verify countVarNames', function () {
        var calc1 = new Calculation('id1', 'var1', '2 + var1');
        var calculations = [ calc1 ];
        expect(calcService.countVarNames('a', calculations)).toEqual(0);
        expect(calcService.countVarNames('var1', calculations)).toEqual(1);

        var calc2 = new Calculation('xxxx', 'var2', 'var1 + 4');
        calculations.push(calc2);
        expect(calcService.countVarNames('var1', calculations)).toEqual(1);

        calc2.varName = 'var1';
        expect(calcService.countVarNames('var1', calculations)).toEqual(2);
    });







});

