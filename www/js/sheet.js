'use strict';


var Sheet = function(par, name, calculations) {
    if (par === null) throw 'undefined parameter for Sheet constructor';
    if (typeof(par) === 'string') {
        //console.log('build from all parameters');
        this.id = par;
        this.name = name;
        this.calculations = calculations;
        this.createdTimestamp = new Date();
        this.favorite = false;
        this.hasSum = false;
        this.sum = undefined;
    } else {
        // build from json object
        this.id = par.id;
        this.name = par.name;
        this.calculations = par.calculations;
        this.createdTimestamp = new Date(par.createdTimestamp);
        this.favorite = par.favorite;
        this.hasSum = par.hasSum;
        this.sum = par.sum;
    }
    this.__type = 'Sheet';
    this.version = '1.0'; // we will use this for versioning and potential updating of storage format
};

Sheet.prototype.nrOfCalcs = function() {
    return this.calculations.length;
};

Sheet.prototype.add = function(calculation) {
    this.calculations.splice(0, 0, calculation);
};

// return the last (highest) number part within calc names  (plural...)
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

Sheet.prototype.getCalculationFor = function(calcName) {
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.calculations[i].varName === calcName) {
            return this.calculations[i];
        }
    }
    throw new Error('Calculation name "' + calcName + '" not found');
};

Sheet.prototype.getValueFor = function(calcName) {
    return this.getCalculationFor(calcName).result;
};

Sheet.prototype.deleteCalculation = function(index) {
    if (index >= this.calculations.length) throw new Error('Illegal argument, index: ' + index);
    var calcName = this.calculations[index].varName;
    var result = this.calculations[index].result;
    var arrayLength = this.calculations.length;
    // replace the usage of calcName with its result
    for (var i = 0; i < arrayLength; i++) {
        // we could skip i===index but we do not bother
        var calculation = this.calculations[i];
        for (var j = 0; j < calculation.expression.length; j++) {
            if (calculation.expression[j] === calcName) {
                calculation.expression[j] = result;
            }
        }
    }
    this.calculations.splice(index, 1);
};



