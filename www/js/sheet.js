'use strict';


var Sheet = function(par, name, calculations) {
    if (par === null) throw 'undefined parameter for Sheet constructor';
    if (typeof(par) === 'string') {
        //console.log('build from params');
        this.id = par;
        this.name = name;
        this.calculations = calculations;
        this.createdTimestamp = new Date();
        this.favorite = false;
    } else {
        // build from object
        // console.log('build from object');
        this.id = par.id;
        this.name = par.name;
        this.calculations = par.calculations;
        this.createdTimestamp = par.createdTimestamp;
        this.favorite = par.favorite;
    }
    this.__type = 'Sheet';
};

Sheet.prototype.nrOfCalcs = function() {
    return this.calculations.length;
};

Sheet.prototype.add = function(calculation) {
    this.calculations.splice(0, 0, calculation);
};

Sheet.prototype.getLastNumberFromCalcName = function() {
    var result = 0;
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        var num = getNumberFromVarname(this.calculations[i].varName);
        if (num > result) {
            result = num;
        }
    }
    return result;
};

//todo: write test
Sheet.prototype.getCalculationFor = function(calcName) {
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.calculations[i].varName === calcName) {
            return this.calculations[i];
        }
    }
    throw new Error('Calculation name "' + calcName + '" not found');
};

//todo: use getCalculationFor
Sheet.prototype.getValueFor = function(calcName) {
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.calculations[i].varName === calcName) {
            return this.calculations[i].result;
        }
    }
    throw new Error('Calculation name "' + calcName + '" not found');
};