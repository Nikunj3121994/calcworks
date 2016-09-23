'use strict';


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

// returns null if name does not contain a number
function getNumberFromVarname(name) {
    var numbers = name.match(/\d+$/);
    if (numbers && numbers.length > 0) {
        return Number(numbers[0]);
    } else {
        return null;
    }
}

// parameter name is the (previous) generated name that is the basis for the next name
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
    if (variable === undefined || variable === null || variable.toString().trim()==='') {
        return false;
    }
    if (variable.length > 20) {
        return false;
    }
    // consider: optimize to store the pattern
    var patt = new RegExp(/^[A-Za-z]/);
    // ik had vroeger:  return new RegExp('^[A-Za-z_]+[0-9]*$')
    return patt.test(variable);
}

function isString(str) {
    return typeof str === 'string' || str instanceof String;
}

function isBinaryOperator(exprItem) {
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

// private
function getDecimalSeparator() {
    var n = 1.1;
    n = n.toLocaleString().substring(1, 2);
    return n;
}

// optimisation, cache result
var decimalSeparatorChar = getDecimalSeparator();
var thousandsSeparatorChar =  (decimalSeparatorChar==='.') ? ',' : '.';

//
//// public
//function getDigitSeparators() {
//    return { decimalSeparator: decimalSeparatorChar, thousandsSeparator: thousandsSeparatorChar };
//}

//    TODO: rename to convertNumberForDisplay
// deze functie behoudt de decimal separator, trailing zero's e.d.
function addThousandSeparators(numberStr) {
    // je kan hier niet toLocaleString gebruiken omdat je dan trailing zero's e.d. kan kwijt raken
    var parts = numberStr.split('.');   // numberStr is not localised
    var integerPart = parts[0];
    var fractionPart = parts.length > 1 ? decimalSeparatorChar + parts[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(integerPart)) {
        integerPart = integerPart.replace(rgx, '$1' + thousandsSeparatorChar + '$2');
    }
    return integerPart + fractionPart;
}

//// public - ik denk dat deze weg kan
//function removeThousandSeparators(numberStr) {
//    var re = new RegExp(thousandsSeparatorChar, "g");
//    return numberStr.replace(re, '');
//}

//// public, this is the localised version   - Kan weg?
//function containsDecimalPart(numberStr) {
//    return numberStr.indexOf(decimalSeparatorChar) >= 0;
//}

// public
function containsPeriodChar(numberStr) {
    return numberStr.indexOf('.') >= 0;
}

// private, public aangeboden via $rootScope
// converts number into a string with max nr of decimals
// returns error if the number is nan or infinite
// deze naam is eigenlijk niet goed. Display is gereserveerd voor de calculatorTab
// TODO: convertNumberToString zou beter zijn
function convertNumberToDisplay(number, nrOfDecimals) {
    // het probleem is dat onderstaande test/assert niet voldoende is,
    // als number een string is komt ie er toch door heen en gaat later fout op toFixed()
    if (isNaN(number) || !isFinite(number)) {
        console.log('error, not a proper number: "'+ number + '"');
        return 'error';
    } else {
        return (+number.toFixed(nrOfDecimals)).toLocaleString();
    }
}


// calcResult is a number
// we return a string with a us decimal separator so it can be used for js math, but the type is string
function convertResultToDisplay(calcResult, nrOfDecimals) {
    //return calcResult.toString();
    return (+calcResult.toFixed(nrOfDecimals)).toString();
}


// MISSCHIEN MOET DIT naar Calculation
// er ontbreekt een base class ExprItem voor deze functies
// testen ontbreken
// geeft de waarde voor een calcName en anders de literal zelf terug
function getExprItemAsString(exprItem, nrOfDecimals, displayCalculationName) {
    if (exprItem === undefined  || exprItem === null) {
        throw new Error('assertion error, empty exprItem');
    } else if (isBinaryOperator(exprItem) || isBracket(exprItem)) {
        return exprItem;
    } else if (exprItem instanceof Calculation) {
        if (displayCalculationName) {
            return exprItem.name;
        } else {
            return convertNumberToDisplay(exprItem.result, nrOfDecimals);
        }
    } else if (exprItem === '_') {
        return '-';  // unaire min
    } else {
        return convertNumberToDisplay(exprItem, nrOfDecimals);
    }
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

//  today = new Date();
function calcDayBeforeAtMidnight(today) {
    var yesterday = new Date(today.valueOf());
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0);
    yesterday.setMinutes(0)
    return yesterday;
}

