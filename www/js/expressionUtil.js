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

// als het eerste karakter een letter is dan beschouwen het een calcname
// cijfers en operators vallen buiten de boot
// leeg argument geeft een error
function isCalcName(variable) {
    // merk op dat de shortcut  !variable  niet werkt ivm het cijfer 0.
    if (variable === undefined || variable === null || variable.toString().trim()==='') throw new EvalError('empty argument');
    // consider: optimize to store the pattern
    var patt = new RegExp(/^[A-Za-z]/);
    return patt.test(variable);
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
// throws SyntaxError if the number is nan or infinite
function convertNumberToDisplay(number, nrOfDecimals) {
    if (isNaN(number) || !isFinite(number)) {
        throw new SyntaxError('nan or infinite');
    } else {
        return (+number.toFixed(nrOfDecimals)).toString();
    }
}