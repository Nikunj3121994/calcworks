"use strict";

// for usd-eur conversion see https://sdw-wsrest.ecb.europa.eu/:

// for currency symbols see http://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
// converter: https://sdw.ecb.europa.eu/curConverter.do

angular.module('calcworks.services')
    .service('conversionService', function ($http, $q, $rootScope, $ionicPopup) {

    // the values of this map are no longer used, might be useful to generate the UI entries
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
        // dit moet wat mooier, je moet de string na de tweede - opzoeken, dan kan je ook de metrics e.d. doen (lastIndexOf)
        var toCurrency = operator.substring(7);
        if (acrCurrency[toCurrency]) {
            this.convertCurrency(deferred, operator, sheet, calc, conversionCalc);
        } else {
            this.convertLengthMeasurement(operator, calc, conversionCalc);
            deferred.resolve(conversionCalc);
        }
        return deferred.promise;
    }



    function getRateName(fromCurrency, toCurrency) {
        // using the full currency name is too long, so we use the acronym
        return fromCurrency + ' to ' + toCurrency + ' rate';
    };


    this.convertCurrency = function(deferred, operator, sheet, calc, conversionCalc) {

        var processExchangeRateResponse = function(fromCurrency, toCurrency, rate) {
            var rateName = getRateName(fromCurrency, toCurrency);
            var rateCalc = sheet.searchCalculation(rateName);
            if (!rateCalc) {
                rateCalc = sheet.createNewCalculation(rateName);
                var tempRate = (toCurrency==='eur') ? 1 / rate : rate;
                rateCalc.expression = [Number(tempRate)];
                rateCalc.result = Number(tempRate);
                sheet.addCalculation(rateCalc);
            }
            conversionCalc.expression = [ calc, 'x', rateCalc ];
            deferred.resolve(conversionCalc);
        };

        var fromCurrency = operator.substring(0, 3);
        var toCurrency = operator.substring(7);
        conversionCalc.name = calc.name + ' in ' + toCurrency;
        this.getExchangeRate(sheet, fromCurrency, toCurrency, processExchangeRateResponse);
    };


    // D: daily,  SP00.A is een code voor exchange rate service
    var ecbURLs = {
      'usd' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1',
      'gbp' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.GBP.EUR.SP00.A?lastNObservations=1', // UK pound sterling
      'chf' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.CHF.EUR.SP00.A?lastNObservations=1', // Swiss franc
      'cny' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.CNY.EUR.SP00.A?lastNObservations=1', // Chinese yuan renminbi
      'jpy' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.JPY.EUR.SP00.A?lastNObservations=1', // Japanese yen
      'krw' : 'https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.KRW.EUR.SP00.A?lastNObservations=1', // South Korean won
    };

    // get the exchange rate for the currency against euro
    // the callback will determine which direction
    this.getExchangeRate = function(sheet, fromCurrency, toCurrency, callback) {

        var currency = (fromCurrency==='eur') ? toCurrency : fromCurrency;

        var processError = function(reason) {
            $rootScope.hideWaitingIcon();
            $ionicPopup.alert({
              title: 'Error occurred',
              template: 'Failed to retrieve exchange rate'
            });

        }

        var processResponse = function(response) {
            var rate = response.data.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
            callback(fromCurrency, toCurrency, rate);
            $rootScope.hideWaitingIcon();
        }

        var request = {
            method: 'GET',
            url: ecbURLs[currency],
            headers: {
                'Accept'  : 'application/vnd.sdmx.data+json;version=1.0.0-cts',
            }
        }

        var rateName = getRateName(fromCurrency, toCurrency);
        var rateCalc = sheet.searchCalculation(rateName);
        if (!rateCalc) {
            $rootScope.showWaitingIcon();
            $http(request)
                .then(processResponse, processError);
        } else {
            callback(fromCurrency, toCurrency, rateCalc.result);
        }
    };


    this.convertLengthMeasurement = function(operator, calc, conversionCalc) {
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
    };


});
