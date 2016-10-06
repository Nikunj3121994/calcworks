'use strict';

// a sheet has a name and contains an array of calculations
var Sheet = function(par, name, calculations) {
    if (par === null) throw 'undefined parameter for Sheet constructor';
    if (typeof(par) === 'string') {
        //console.log('build from all parameters');
        this.id = par;
        this.name = name;
        this.calculations = calculations;
        this.createdTimestamp = new Date();
        this.updatedTimestamp = this.createdTimestamp;
        this.favorite = false;
        this.hasSum = false;  // waarom deze flag? je kan toch naar undefined waarde kijken van .sum
        this.inputCalculation = undefined;
        this.outputCalculation = undefined;
        this.sum = undefined;
        this.max = undefined;
    } else {
        // reconstruct object from json
        this.id = par.id;
        this.name = par.name;
        this.calculations = par.calculations;
        this.createdTimestamp = new Date(par.createdTimestamp);
        this.updatedTimestamp = new Date(par.updatedTimestamp);
        this.favorite = par.favorite;
        this.hasSum = par.hasSum;
        this.sum = par.sum;
        this.max = par.max;
        this.inputCalculation = par.inputCalculation;
        this.outputCalculation = par.outputCalculation;
    }
    this.__type = 'Sheet';
    this.version = '1.0'; // we will use this for versioning and potential updating of storage format
};

Sheet.prototype.defaultName = 'Untitled Sheet';

Sheet.prototype.nrOfCalcs = function() {
    return this.calculations.length;
};

Sheet.prototype.addCalculation = function(calculation) {
    this.calculations.splice(0, 0, calculation);
};

// return the last (highest) number part within calc names  (plural...)
Sheet.prototype.getLastNumberFromCalcName = function() {
    var result = 0;
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        var num = getNumberFromVarname(this.calculations[i].name);
        if (num > result) {
            result = num;
        }
    }
    return result;
};

Sheet.prototype.getLastCalcName = function() {
    return 'calc' + this.getLastNumberFromCalcName();
};


Sheet.prototype.createNewCalculation = function(optionalName) {
    var name;
    if (optionalName) {
        name = optionalName
    } else {
        name = generateCalcName(this.getLastCalcName());
    }
    var id = generateUUID();
    var calc = new Calculation(id, name, []);
    return calc;
}


Sheet.prototype.getCalculationFor = function(calcName) {
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.calculations[i].name === calcName) {
            return this.calculations[i];
        }
    }
    throw new Error('Calculation name "' + calcName + '" not found');
};

Sheet.prototype.getValueFor = function(calcName) {
    return this.getCalculationFor(calcName).result;
};

// unfortunately this is a pretty expensive operation, we need to go through each expression item
// to keep the referential integrity
Sheet.prototype.deleteCalculation = function(index) {
    if (index >= this.calculations.length) throw new Error('Illegal argument, index: ' + index);
    if (this.inputCalculation === this.calculations[index]) {
        this.inputCalculation = undefined;
    }
    if (this.outputCalculation === this.calculations[index]) {
        this.outputCalculation = undefined;
    }
    var calc = this.calculations[index];
    var result = this.calculations[index].result;
    var arrayLength = this.calculations.length;
    // replace the usage of calculation with its result
    for (var i = 0; i < arrayLength; i++) {
        // we could skip i===index but we do not bother
        var calculation = this.calculations[i];
        for (var j = 0; j < calculation.expression.length; j++) {
            if (calculation.expression[j] === calc) {
                calculation.expression[j] = calculation.expression[j].result;
            }
        }
    }
    this.calculations.splice(index, 1);
};



