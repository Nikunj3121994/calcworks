'use strict';

// todo: namespace

// calculation object, should be serializable
// varName field had gewoon name moeten heten of calcName
// expression zou een array van ExprItem moeten zijn. Dan kunnen we in ExprItem een hoop methods kwijt
// echter de conversie naar string (diplay zeg maar) blijft een probleem omdat het aantal decimalen in rootscope zit

var Calculation = function(param, calcName, expression) {
    if (param === null) throw 'undefined parameter for Calculation constructor';
    // bepaal of de aanroep een json deserialize is of niet
    if (typeof(param) === 'string') {
        //console.log('info: build calc from parameters: ' + param + ', ' + varName + ', ' + expression);
        this.id = param;   // we not use generateUUID() here because this makes the tests harder to write
        this.varName = calcName;
        this.expression = expression;   // this is an array of numbers, calcNames and operators
        this.result = null;    // can be a number or a string in case of error
    } else {
        //console.log('build calc from json');
        this.id = param.id;
        this.varName = param.varName;
        this.expression = param.expression;
        this.result = param.result;
    }
    this.__type = 'Calculation';
};

Calculation.prototype.validName  = function(calcName) {
    //todo: identical/similar to reg exp in parseVars  -> unify
    // we can optimize this by putting the regExp in constant
    // ^ and $ are zero-word boundaries
    return new RegExp('^[A-Za-z_]+[0-9]*$').test(calcName);
};


// returns array of unique variable names in expression, can be empty array (not null)
//todo: we hebben deze routine zelfstandig nodig in bijv expressionUtil.js, en gebruik calcNames ipv varNames
// verwijder deze routine maar
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

