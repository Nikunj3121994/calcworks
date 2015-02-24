'use strict';


var Sheet = function(name, calculations) {
    this.name = name;
    this.calculations = calculations;
    this.createdTimestamp = new Date();
    this.favorite = false;
};

Sheet.prototype.nrOfCalcs = function() {
    return this.calculations.length;
}

Sheet.prototype.add = function(calculation) {
    this.calculations.push(calculation);
}
