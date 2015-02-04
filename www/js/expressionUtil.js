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

// parameter varName is the (previous) generated varName that is the basis for the next varName
function generateVarName(varName) {
    if (varName) {
        var thenum = varName.match(/\d+$/)[0];
        if (thenum) {
            var number = Number(thenum) + 1;
            return varName.replace(thenum, number);
        }
    }
    return 'calc1';
}

