"use strict";

// for usd-eur conversion see https://sdw-wsrest.ecb.europa.eu/:

angular.module('calcworks.services')
    .service('conversionService', function ($http, $q, $rootScope, $ionicPopup) {


    var acrCurrency = {
      'eur' : 'euro',
      'usd' : 'US dollar',
      'gbp' : 'UK pound',
      'chf' : 'Swiss franc',
      'cny' : 'Chinese yuan renminbi',
      'jpy' : 'Japanese yen',
      'krw' : 'South Korean won'
    };


    // returns a promise
    this.convert = function(operator, sheet, calc) {
        // we use the deferred pattern to make the sync operations also to be treated async
        var deferred = $q.defer();
        var conversionCalc = sheet.createNewCalculation();
        var processExchangeRateResponseToCurrency = function(currency, rate) {
                var rateName = 'euro to ' + acrCurrency[currency] + ' rate';
                var rateCalc = sheet.searchCalculation(rateName);
                if (!rateCalc) {
                    rateCalc = sheet.createNewCalculation(rateName);
                    rateCalc.expression = [Number(rate)];
                    rateCalc.result = Number(rate);
                    sheet.addCalculation(rateCalc);
                }
                conversionCalc.expression = [ calc, 'x', rateCalc ];
                deferred.resolve(conversionCalc);
            };
        var processExchangeRateResponseToEUR = function(currency, rate) {
                var rateName = acrCurrency[currency] + ' to euro rate';
                var rateCalc = sheet.searchCalculation(rateName);
                if (!rateCalc) {
                    rateCalc = sheet.createNewCalculation(rateName);
                    var inverseRate = 1 / rate;
                    rateCalc.expression = [Number(inverseRate)];
                    rateCalc.result = Number(inverseRate);
                    sheet.addCalculation(rateCalc);
                }
                conversionCalc.expression = [ calc, 'x', rateCalc ];
                deferred.resolve(conversionCalc);
            };
        // dit moet wat mooier, je moet de string na de tweede - opzoeken, dan kan je ook de metrics e.d. doen
        var toCurrency = operator.substring(7);
        if (acrCurrency[toCurrency]) {
            conversionCalc.name = calc.name + ' in ' + acrCurrency[toCurrency];
            $rootScope.showWaitingIcon();
            if (operator === 'usd-to-eur') {
                this.getExchangeRate('usd', processExchangeRateResponseToEUR);
            } else if (operator === 'gbp-to-eur') {
                this.getExchangeRate('gbp', processExchangeRateResponseToEUR);
            } else if (operator === 'chf-to-eur') {
                this.getExchangeRate('chf', processExchangeRateResponseToEUR);
            } else if (operator === 'eur-to-usd') {
                this.getExchangeRate('usd', processExchangeRateResponseToCurrency);
            } else if (operator === 'eur-to-gbp') {
                this.getExchangeRate('gbp', processExchangeRateResponseToCurrency);
            } else if (operator === 'eur-to-chf') {
                this.getExchangeRate('chf', processExchangeRateResponseToCurrency);
            }
        } else {
            if (operator === 'inch-to-centimeters') {
                conversionCalc.name = calc.name + ' to centimeters';
                conversionCalc.expression = [ calc, 'x', 2.54];
            } else
            if (operator === 'centimeters-to-inch') {
                conversionCalc.name = calc.name + ' to inches';
                conversionCalc.expression = [ calc, '/', 2.54];
            } else
            if (operator === 'kilometers-to-miles') {
                conversionCalc.name = calc.name + ' to miles';
                conversionCalc.expression = [ calc, '/', 1.609344];
            } else
            if (operator === 'miles-to-kilometers') {
                conversionCalc.name = calc.name + ' to kilometers';
                conversionCalc.expression = [ calc, 'x', 1.609344];
            } else
            if (operator === 'fahrenheit-to-celcius') {
                conversionCalc.name = calc.name + ' to Celcius';
                conversionCalc.expression = [ '(', calc, '-', 32.0, ')', '/', 1.80];
            } else
            if (operator === 'celcius-to-fahrenheit') {
                conversionCalc.name = calc.name + ' to Fahrenheit';
                conversionCalc.expression = [ calc, 'x', 1.8, '+', 32.0];
            } else {
                alert('invalid function: ' + operator);
            }
            deferred.resolve(conversionCalc);
        }
        return deferred.promise;
    }


    // D: daily,  SP00.A is een code voor exchange rate service
    var ecbURLs = {
      'usd' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1',
      'gbp' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.GBP.EUR.SP00.A?lastNObservations=1', // UK pound sterling
      'chf' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.CHF.EUR.SP00.A?lastNObservations=1', // Swiss franc
      'cny' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.CNY.EUR.SP00.A?lastNObservations=1', // Chinese yuan renminbi
      'jpy' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.JPY.EUR.SP00.A?lastNObservations=1', // Japanese yen
      'krw' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.KRW.EUR.SP00.A?lastNObservations=1', // South Korean won
    };

    this.getExchangeRate = function(currency, callback) {
        var processError = function(reason) {
            $rootScope.hideWaitingIcon();
            $ionicPopup.alert({
              title: 'Error',
              template: 'Failed to retrieve exchange rate'
            });

        }

        var processResponse = function(response) {
            var rate = response.data.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
            callback(currency, rate);
            $rootScope.hideWaitingIcon();
        }

        var request = {
            method: 'GET',
            url: ecbURLs[currency],
            headers: {
                'Accept'  : 'application/vnd.sdmx.data+json;version=1.0.0-cts',
            }
        }
        $http(request)
            .then(processResponse, processError);
    };


});
