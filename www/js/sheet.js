'use strict';

// a sheet has a name and contains an array of calculations
var Sheet = function(par, name, calculations) {
    // version 1.0 - start version
    // version 1.1 - added numberDisplayOption field and moved hasSum to displayOption
    if (par === null) throw 'undefined parameter for Sheet constructor';
    if (typeof(par) === 'string') {
        //console.log('build from all parameters');
        this.id = par;
        this.name = name;
        this.calculations = calculations;
        this.createdTimestamp = new Date();
        this.updatedTimestamp = this.createdTimestamp;
        this.favorite = false;
        this.inputCalculation = undefined;
        this.outputCalculation = undefined;
        this.sum = undefined;
        this.max = undefined;
        this.numberDisplayOption = {}; // fields: minimumFractionDigits: 0 or 2
        // fields: style {ext, expr, cond} , showGraphBar bool, showSum bool
        // style: ext (extended), expr (expression), (cond) condensed
        // if style is not set then the view will display extended
        this.displayOption = {};
    } else {
        // reconstruct object from json
        this.id = par.id;
        this.name = par.name;
        this.calculations = par.calculations;
        this.createdTimestamp = new Date(par.createdTimestamp);
        this.updatedTimestamp = new Date(par.updatedTimestamp);
        this.favorite = par.favorite;
        this.sum = par.sum;
        this.max = par.max;
        this.inputCalculation = par.inputCalculation;
        // added field numberDisplayOption
        this.outputCalculation = par.outputCalculation;
        if (par.numberDisplayOption) {
            this.numberDisplayOption = par.numberDisplayOption;
        } else {
            this.numberDisplayOption = {};
        }
        if (par.displayOption) {
            this.displayOption = par.displayOption;
        } else {
            this.displayOption = {};
            if (par.hasSum) {
                this.displayOption.showSum = true;
            }
        }
    }
    this.version = '1.1'; // we can look at this value when we reconstruct from json
    this.__type = 'Sheet';
};

Sheet.prototype.defaultName = 'Untitled Sheet';

Sheet.prototype.nrOfCalcs = function() {
    return this.calculations.length;
};

Sheet.prototype.addCalculation = function(calculation) {
    if (!calculation)
        throw "parameter calculation is null";
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

Sheet.prototype.getMostRecentCalculation = function() {
    if (this.calculations.length === 0)
        return null
    else return this.calculations[0];
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


// returns null if not found
Sheet.prototype.searchCalculation = function(calcName) {
    var arrayLength = this.calculations.length;
    for (var i = 0; i < arrayLength; i++) {
        if (this.calculations[i].name === calcName) {
            return this.calculations[i];
        }
    }
    return null;
};

// throws exception if not found
Sheet.prototype.getCalculationFor = function(calcName) {
    var calc = this.searchCalculation(calcName);
    if (calc) { return calc } else throw new Error('Calculation name "' + calcName + '" not found');
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



