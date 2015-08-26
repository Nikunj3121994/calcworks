'use strict';

// should we namespace these methods?
// CalcApp.Utils = {

function addSpaceIfNeeded(string) {
    if (string) {
        var lastChar = string.substr(string.length - 1);
        if (lastChar === ' ') {
            return string;
        } else if (lastChar === '(') {
            return string;
        } else {
            return string + ' ';
        }
    } else {
        return '';
    }
}

// dit zou wel eens veel beter via een factory provider kunnen (https://docs.angularjs.org/guide/providers)
function getDecimalSeparator() {
    var n = 1.1;
    n = n.toLocaleString().substring(1, 2);
    return n;
}

// returns null if varName does not contain a number
function getNumberFromVarname(varName) {
    var numbers = varName.match(/\d+$/);
    if (numbers && numbers.length > 0) {
        return Number(numbers[0]);
    } else {
        return null;
    }
}

// parameter varName is the (previous) generated varName that is the basis for the next varName
function generateCalcName(calcName) {
    if (calcName) {
        var thenum = getNumberFromVarname(calcName);
        if (thenum) {
            var number = thenum + 1;
            return calcName.replace(thenum, number);
        }
    }
    return 'calc1';
}

function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// als het eerste karakter een letter is dan beschouwen het een valide object name (calculation en sheet)
// cijfers en operators vallen buiten de boot
// leeg argument geeft een error
function isValidObjectName(variable) {
    // merk op dat de shortcut  !variable  niet werkt ivm het cijfer 0.
    if (variable === undefined || variable === null || variable.toString().trim()==='') throw new EvalError('empty argument');
    // consider: optimize to store the pattern
    var patt = new RegExp(/^[A-Za-z]/);
    return patt.test(variable);
}

function isString(str) {
    return typeof str === 'string' || str instanceof String;
}

function isOperator(exprItem) {
    if (isString(exprItem)) {
        var char = exprItem.charAt(0);
        return char === '+' || char === '-' || char === 'x' || char === '/' || char === '%';
    } else {
        return false;
    }
}

function isBracket(exprItem) {
    if (isString(exprItem)) {
        var char = exprItem.charAt(0);
        return char === '(' || char === ')';
    } else {
        return false;
    }
}

// expression is an array
function countOccurencesInExpression(string, expression) {
    var count = 0;
    var calculationLength = expression.length;
    for (var i = 0; i < calculationLength; i++) {
        if (string === expression[i]) {
            count++;
        }
    }
    return count;
}

// ook aangeboden via $rootScope
// converts number into a string with max nr of decimals
// returns error if the number is nan or infinite
function convertNumberToDisplay(number, nrOfDecimals) {
    if (isNaN(number) || !isFinite(number)) {
        return 'error';
    } else {
        return (+number.toFixed(nrOfDecimals)).toString();
    }
}

// MISSCHIEN MOET DIT naar Calculation
// er ontbreekt een base class ExprItem voor deze functies
// testen ontbreken
// geeft de waarde voor een calcName en anders de literal zelf terug
function getExprItemAsString(exprItem, sheet, nrOfDecimals) {
    if (isOperator(exprItem) || isBracket(exprItem)) {
        return exprItem;
    } else if (exprItem instanceof Calculation) {
        return convertNumberToDisplay(exprItem.result, nrOfDecimals);
    } else {
        return convertNumberToDisplay(exprItem, nrOfDecimals);
    }
}

function getExprItemIfCalcName(exprItem) {
    throw new Error('deze moet je vervangen door instanceOf Calculation');
}

// note we do not use Ionic's next id since it is not unique across sessions
// consider: prefix with type identifier like sheet, calc, etc
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

