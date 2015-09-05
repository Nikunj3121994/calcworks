'use strict';

// todo: namespace

// calculation object, should be serializable
// expression zou een array van ExprItem moeten zijn. Dan kunnen we in ExprItem een hoop methods kwijt
// echter de conversie naar string (diplay zeg maar) blijft een probleem omdat het aantal decimalen in rootscope zit

var Calculation = function(param, calcName, expression) {
    if (param === null) throw 'undefined parameter for Calculation constructor';
    // bepaal of de aanroep een json deserialize is of niet
    if (typeof(param) === 'string') {
        //console.log('info: build calc from parameters: ' + param + ', ' + name + ', ' + expression);
        this.id = param;   // we not use generateUUID() here because this makes the tests harder to write
        this.name = calcName;
        this.expression = expression;   // this is an array of numbers, calcNames and operators
        this.result = null;    // can be a number or a string in case of error
    } else {
        //console.log('build calc from json');
        this.id = param.id;
        this.name = param.name;
        this.expression = param.expression;
        this.result = param.result;
    }
    this.__type = 'Calculation';
};

//  duplicate van isValidObjectName
Calculation.prototype.validName  = function(calcName) {
    //todo: identical/similar to reg exp in parseVars  -> unify
    // we can optimize this by putting the regExp in constant
    // ^ and $ are zero-word boundaries
    return new RegExp('^[A-Za-z_]+[0-9]*$').test(calcName);
};


