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
        return char === '+' || char === '-' || char === 'x' || char === '/' || char === '%' || char === '^';
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


// deze functie behoudt de decimal separator, trailing zero's e.d. zodat ie in het inpput display panel getoond kan worden
// numberStr is een getal als string met us decimal separator
// result is een localised getal (thousand and decimal seps) as string
// deze functie zou eigenlijk convertNumberStrForDisplay moeten heten
function convertNumberForDisplay(numberStr) {
    // je kan hier niet toLocaleString gebruiken omdat je dan trailing zero's e.d. kan kwijt raken
    var parts = numberStr.split('.');   // find decimal separator, note that numberStr is not localised
    var integerPart = parts[0];
    var fractionPart = parts.length > 1 ? decimalSeparatorChar + parts[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(integerPart)) {
        integerPart = integerPart.replace(rgx, '$1' + thousandsSeparatorChar + '$2');
    }
    return integerPart + fractionPart;
}

// public
function containsPeriodChar(numberStr) {
    return numberStr.indexOf('.') >= 0;
}


// deze functie geeft number (float) als string localised terug zodat ie getoond kan worden
// deze functie kan overal gebruikt worden voor display/rendering doeleiden, behalve de input display
// options is null - meaning that the required number of digits is shown up to max 2. E.g.:  0 ,  0.1  ,  0.23
// this is the same as minimumFractionDigits: 0, maximumFractionDigits=2
// or options.minimumFractionDigits = 2 - meaning that always 2 digits are shown. E.g. 0.00 , 0.10  , 0.23
// this is the same as minimumFractionDigits: 2, maximumFractionDigits=2
// similar to Intl.NumberFormat
function convertNumberForRendering(number, options) {
    if (number === null) {
        return ''; // result is not known
    } else if (isNaN(number) || !isFinite(number)) {
        return 'error';
    } else {
        if (options == null || !options.minimumFractionDigits) {
                return (+number.toFixed(2)).toLocaleString();
            } else {
                if (options.minimumFractionDigits && options.minimumFractionDigits !==2) throw Error('invalid argument options: ' + JSON.stringify(options));
                return convertNumberToAmountStr(number);
            }
    }
}

// internal use only, use convertNumberForRendering instead
function convertNumberToAmountStr(number) {
    // problem is that locale parameter in toLocaleString () call is unknown
    // so this is a big workaround
    var integerPart = Math.floor(number);
    var temp1 = integerPart.toLocaleString();
    var temp2;
    if (Number.isInteger(number)) {
        temp2 = '00';
    } else {
        var fractionPart = number % 1;
        // default to US locale and drop the '0.' sub string
        temp2 = fractionPart.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).slice(2);
    }
    return temp1 + decimalSeparatorChar + temp2;
}




// testen ontbreken
// geeft de waarde voor een calcName en anders de literal zelf terug depending on displayCalculationName
// numberDisplayOption are explained in convertNumberForRendering
// all parameters are required
function getExprItemForRendering(exprItem, numberDisplayOption, displayCalculationName) {
    if (exprItem === undefined  || exprItem === null) {
        throw new Error('assertion error, empty exprItem');
    } else if (isBinaryOperator(exprItem) || isBracket(exprItem)) {
        return exprItem;
    } else if (exprItem instanceof Calculation) {
        if (displayCalculationName) {
            return exprItem.name;
        } else {
            return convertNumberForRendering(exprItem.result, numberDisplayOption);
        }
    } else if (exprItem === '_') {
        return '-';  // unaire min
    } else {
        return convertNumberForRendering(exprItem, numberDisplayOption);
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

// Safari does not support ECMAScript Internationalization API
// monthIndex is zero based
function getNameOfMonth(monthIndex) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
}