'use strict';

// todo: namespace

// calculation object, should be serializable

var Calculation = function(id, varName, expression) {
    this.id = id;   // we not use generateUUID() here because this makes the tests harder to write
    this.varName = varName;
    this.expression = expression;
    this.result = null;    // can be a number or a string in case of error

};

Calculation.prototype.validName  = function(varName) {
    //todo: identical/similar to reg exp in parseVars  -> unify
    // we can optimize this by putting the regExp in constant
    // ^ and $ are zero-word boundaries
    return new RegExp('^[A-Za-z_]+[0-9]*$').test(varName);
}


// returns array of unique variable names in expression, can be empty array (not null)
Calculation.prototype.parseVarsExpression = function() {
    // reg expression: one or more characters followed by zero or more digits
    // g stands for globale (multiple matches)
    var varnames = this.expression.match(/[A-Za-z_]+[0-9]*/g);
    var result = [];
    // make unique
    if (varnames) {
        var varnamesLength = varnames.length;
        for (var i = 0; i < varnamesLength; i++) {
            if (result.indexOf(varnames[i]) < 0) {
                result.push(varnames[i]);
            }
        }
    }
    return result;
};

