"use strict";

angular.module('calcworks.services')
    .service('conversionService', function ($http, $q) {

    // returns a promise
    this.convert = function(operator, sheet, calc) {
        // we use the deferred pattern to make the sync operations also async
        var deferred = $q.defer();
        var conversionCalc = sheet.createNewCalculation();
        var processExchangeRateResponse = function(rate) {
            console.log('rate: ' + rate);
                conversionCalc.expression = [ calc, 'x', Number(rate) ];
                deferred.resolve(conversionCalc);
            };
        if (operator === 'usd-to-eur') {
            conversionCalc.name = calc.name + 'toUSD';
            this.getUSDtoEUR(processExchangeRateResponse);
        } else if (operator === 'eur-to-usd') {
            conversionCalc.name = calc.name + 'toEUR';
            this.getEURtoUSD(processExchangeRateResponse);
        } else {
            if (operator === 'inch-to-centimeters') {
                conversionCalc.name = calc.name + 'toCentimeters';
                conversionCalc.expression = [ calc, 'x', 2.54];
            } else
            if (operator === 'centimeters-to-inch') {
                conversionCalc.name = calc.name + 'toInches';
                conversionCalc.expression = [ calc, '/', 2.54];
            } else
            if (operator === 'kilometers-to-miles') {
                conversionCalc.name = calc.name + 'toMiles';
                conversionCalc.expression = [ calc, '/', 1.609344];
            } else
            if (operator === 'miles-to-kilometers') {
                conversionCalc.name = calc.name + 'toKilometers';
                conversionCalc.expression = [ calc, 'x', 1.609344];
            } else
            if (operator === 'fahrenheit-to-celcius') {
                conversionCalc.name = calc.name + 'toCelcius';
                conversionCalc.expression = [ '(', calc, '-', 32.0, ')', '/', 1.80];
            } else
            if (operator === 'celcius-to-fahrenheit') {
                conversionCalc.name = calc.name + 'toFahrenheit';
                conversionCalc.expression = [ calc, 'x', 1.8, '+', 32.0];
            } else {
                alert('invalid function: ' + operator);
            }
            deferred.resolve(conversionCalc);
        }
        return deferred.promise;
    }




    this.getUSDtoEUR = function(callback) {
        var processError = function(response) {
            console.log('processError: ' + JSON.stringify(response));
        }

        var processResponse = function(response) {
            var rate = response.data.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
            callback(rate);
        }

        var request = {
            method: 'GET',
            // D: daily,  SP00.A is een code voor exchange rate service
            url: 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1',
            headers: {
                'Accept'  : 'application/vnd.sdmx.data+json;version=1.0.0-cts',
            }
        }
        $http(request)
            .then(processResponse, processError);
    };


    this.getEURtoUSD = function(callback) {
        var processError = function(response) {
            console.log('processError: ' + JSON.stringify(response));
        }

        var processResponse = function(response) {
            var rate = response.data.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
            callback(rate);
        }

        var request = {
            method: 'GET',
            // D: daily,  SP00.A is een code voor exchange rate service
            url: 'https://sdw-wsrest.ecb.europa.eu/service/data/FX/D.EUR.USD.SP00.A?lastNObservations=1',
            headers: {
                'Accept'  : 'application/vnd.sdmx.data+json;version=1.0.0-cts',
            }
        }
        $http(request)
            .then(processResponse, processError);
    };



});
