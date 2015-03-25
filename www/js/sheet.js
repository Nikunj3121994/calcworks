'use strict';


var Sheet = function(par, calculations) {
    if (par === null) throw 'undefined parameter for Sheet constructor';
    if (typeof(par) === 'string') {
        //console.log('build from params');
        this.name = par;
        this.calculations = calculations;
        this.createdTimestamp = new Date();
        this.favorite = false;
    } else {
        // build from object
        // console.log('build from object');
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
    this.calculations.push(calculation);
    //this.calculations.splice(0, 0, calculation);
};


Sheet.prototype.getLastNumberFromVarName = function() {
    var result = 0;
    for (var i in this.calculations) {
        var num = getNumberFromVarname(this.calculations[i].varName);
        if (num > result) {
            result = num;
        }
    }
    return result;
};
