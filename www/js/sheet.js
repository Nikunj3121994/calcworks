'use strict';


var Sheet = function(name, calculations) {
    this.id = ionic.Utils.nextUid(); // ionic util
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
