'use strict';


var Sheet = function(name, calculations) {
    this.name = name;
    this.calculations = calculations;
};

Sheet.prototype.nrOfCalcs = function() {
    return this.calculations.length;
}

Sheet.prototype.add = function(calculation) {
    this.calculations.push(calculation);
}
