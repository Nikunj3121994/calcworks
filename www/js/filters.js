"use strict";

angular.module('calcworks.controllers')

// filter that expects a number (not a string!) and converts it to a string with the right decimals
    //todo: display thousand separator
.filter('toFixedDecimals', function($log, $rootScope) {
    return function (input) {
        if (input === undefined || input === null) {
            return null;
        } else {
            return $rootScope.convertNumberToDisplay(input);
        }
    };

}).filter('toDate', function($filter) {

    function areDaysEqual(day1, day2) {
        return day2.getDate() === day1.getDate() && day2.getMonth() === day1.getMonth() && day2.getFullYear() === day1.getFullYear();
    }

    return function(timestamp) {
        var dateFilter = $filter('date');
        var today = new Date();
        if (areDaysEqual(today, timestamp)) {
            return 'today at ' + dateFilter(timestamp, 'HH:MM');
        } else {
            var yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
            if (areDaysEqual(yesterday, timestamp)) {
                return 'yesterday at ' + dateFilter(timestamp, 'HH:MM');
            } else {
                return dateFilter(timestamp, 'dd MMM yyyy');
            }
        }
    };

});
