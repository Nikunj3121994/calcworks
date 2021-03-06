"use strict";

angular.module('calcworks.controllers')

// filter that expects a number (not a string!) and converts it to a string with the localised decimals and thousands separator
// options is defined in convertNumberForRendering
.filter('toFixedDecimals', function($log, $rootScope) {
    return function (input, options) {
        if (input === undefined || input === null) {
            return null;
        } else {
            return $rootScope.convertNumberForRendering(input, options);
        }
    };
}).filter('toDate', function($filter) {
//toTimestamp zou betere naam zijn

    function areDaysEqual(day1, day2) {
        return day2.getDate() === day1.getDate() && day2.getMonth() === day1.getMonth() && day2.getFullYear() === day1.getFullYear();
    }

    function getTimeAsString(timestamp) {
        // using the dateFilter as shown below gives inaccurate time, no clue why
        // return dateFilter(timestamp, 'HH:MM');
        return timestamp.getHours() + ':' + ((timestamp.getMinutes() < 10)?"0":"") + timestamp.getMinutes();
    }

    var cachedTodayMs = 0;
    var cachedYesterday;

    function getYesterday() {
        if (Date.now() - cachedTodayMs > 1000) {
            var today = new Date();
            cachedTodayMs = today.valueOf();
            cachedYesterday = calcDayBeforeAtMidnight(today);
        }
        return cachedYesterday;
    }

    return function(timestamp) {
        if (!timestamp) return '';
        var yesterday = getYesterday();
        if (timestamp < yesterday) {
            var dateFilter = $filter('date');
            return dateFilter(timestamp, 'dd MMM yyyy');
        } else if (areDaysEqual(new Date(), timestamp)) {
            return 'today at ' + getTimeAsString(timestamp);
        } else {
            return 'yesterday at ' + getTimeAsString(timestamp);
        }
    };

});
