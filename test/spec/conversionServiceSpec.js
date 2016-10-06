'use strict';

describe('Test conversionService', function () {

    beforeEach(module('calcworks'));

    var conversionService, scope, httpBackend;
    var convertedCalc;
    var sheet = new Sheet('id', 'foo', []);
    var calc = new Calculation('id', 'varname', [ 2 ]);

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function ($rootScope, _conversionService_, $httpBackend) {
        conversionService = _conversionService_;
         scope = $rootScope.$new();
         httpBackend = $httpBackend;
    }));

    function mockBackEnd() {
        httpBackend.expectGET('templates/tab-sheets.html').respond(200); //mimicking the AJAX call
        httpBackend.expectGET('templates/sheet-detail.html').respond(200);
        httpBackend.expectGET('templates/tab-calculator.html').respond(200);
        httpBackend.expectGET('templates/tabs.html').respond(200);
    }

    it('verify centimeters-to-inch', function() {
        var convertedCalcPromise = conversionService.convert('centimeters-to-inch', sheet, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        scope.$digest();
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual([calc, '/', 2.54]);
    });

    it('verify inch-to-centimeters', function() {
        var convertedCalcPromise = conversionService.convert('inch-to-centimeters', sheet, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        scope.$digest();
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual([calc, 'x', 2.54]);
    });

    it('verify miles-to-kilometers', function() {
        var convertedCalcPromise = conversionService.convert('miles-to-kilometers', sheet, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        scope.$digest();
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual([calc, 'x', 1.609344]);
    });

    it('verify kilometers-to-miles', function() {
        var convertedCalcPromise = conversionService.convert('kilometers-to-miles', sheet, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        scope.$digest();
                expect(convertedCalc.result).toBeNull();
                expect(convertedCalc.expression).toEqual([calc, '/', 1.609344]);
    });


    it('verify fahrenheit-to-celcius', function() {
        var convertedCalcPromise = conversionService.convert('fahrenheit-to-celcius', sheet, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        scope.$digest();
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual(['(', calc, '-', 32, ')', '/', 1.8]);
    });


    it('verify celcius-to-fahrenheit', function() {
        var convertedCalcPromise = conversionService.convert('celcius-to-fahrenheit', sheet, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        scope.$digest();
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual([calc, 'x', 1.8, '+', 32]);
    });


    // copied response from console, and removed "data:" and the curly brackets
    var responseUSD_EUR = '{"header":{"id":"9b936b3b-4b42-4613-83f4-53d68f98b56c","test":false,"prepared":"2016-10-05T20:41:28.380+02:00","sender":{"id":"ECB"}},"dataSets":[{"action":"Replace","validFrom":"2016-10-05T20:41:28.380+02:00","series":{"0:0:0:0:0":{"attributes":[null,null,0,null,null,null,null,null,null,null,0,null,0,null,0,0,0,0],"observations":{"0":[1.2,0,null,null,null]}}}}],"structure":{"links":[{"title":"Exchange Rates","rel":"dataflow","href":"https://sdw-wsrest.ecb.europa.eu:443null/service/dataflow/ECB/EXR/1.0"}],"name":"Exchange Rates","dimensions":{"series":[{"id":"FREQ","name":"Frequency","values":[{"id":"D","name":"Daily"}]},{"id":"CURRENCY","name":"Currency","values":[{"id":"USD","name":"US dollar"}]},{"id":"CURRENCY_DENOM","name":"Currency denominator","values":[{"id":"EUR","name":"Euro"}]},{"id":"EXR_TYPE","name":"Exchange rate type","values":[{"id":"SP00","name":"Spot"}]},{"id":"EXR_SUFFIX","name":"Series variation - EXR context","values":[{"id":"A","name":"Average"}]}],"observation":[{"id":"TIME_PERIOD","name":"Time period or range","role":"time","values":[{"id":"2016-10-05","name":"2016-10-05","start":"2016-10-05T00:00:00.000+02:00","end":"2016-10-05T23:59:59.999+02:00"}]}]},"attributes":{"series":[{"id":"TIME_FORMAT","name":"Time format code","values":[]},{"id":"BREAKS","name":"Breaks","values":[]},{"id":"COLLECTION","name":"Collection indicator","values":[{"id":"A","name":"Average of observations through period"}]},{"id":"DOM_SER_IDS","name":"Domestic series ids","values":[]},{"id":"PUBL_ECB","name":"Source publication (ECB only)","values":[]},{"id":"PUBL_MU","name":"Source publication (Euro area only)","values":[]},{"id":"PUBL_PUBLIC","name":"Source publication (public)","values":[]},{"id":"UNIT_INDEX_BASE","name":"Unit index base","values":[]},{"id":"COMPILATION","name":"Compilation","values":[]},{"id":"COVERAGE","name":"Coverage","values":[]},{"id":"DECIMALS","name":"Decimals","values":[{"id":"4","name":"Four"}]},{"id":"NAT_TITLE","name":"National language title","values":[]},{"id":"SOURCE_AGENCY","name":"Source agency","values":[{"id":"4F0","name":"European Central Bank (ECB)"}]},{"id":"SOURCE_PUB","name":"Publication source","values":[]},{"id":"TITLE","name":"Title","values":[{"name":"US dollar/Euro"}]},{"id":"TITLE_COMPL","name":"Title complement","values":[{"name":"ECB reference exchange rate, US dollar/Euro, 2:15 pm (C.E.T.)"}]},{"id":"UNIT","name":"Unit","values":[{"id":"USD","name":"US dollar"}]},{"id":"UNIT_MULT","name":"Unit multiplier","values":[{"id":"0","name":"Units"}]}],"observation":[{"id":"OBS_STATUS","name":"Observation status","values":[{"id":"A","name":"Normal value"}]},{"id":"OBS_CONF","name":"Observation confidentiality","values":[]},{"id":"OBS_PRE_BREAK","name":"Pre-break observation value","values":[]},{"id":"OBS_COM","name":"Observation comment","values":[]}]}},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"url":"https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1","headers":{"Accept":"application/vnd.sdmx.data+json;version=1.0.0-cts"}},"statusText":"OK"}';

    it('verify USDtoEUR', function() {
        var sheet2 = new Sheet('id', 'foo', []);
        var convertedCalcPromise = conversionService.convert('usd-to-eur', sheet2, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        httpBackend.expectGET('https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1').respond(200, responseUSD_EUR);
        // scope.$digest(); is not needed because of the flush()
        httpBackend.flush();
        // verify a new calculation is added to the sheet
        expect(sheet2.calculations.length).toBe(1);
        var rateCalc = sheet2.calculations[0];
        expect(rateCalc.name).toBe('usd to euro rate');
        expect(rateCalc.expression).toEqual([ 0.8333333333333334]);
        expect(rateCalc.result).toBe( 0.8333333333333334);
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual([calc, 'x', rateCalc ]);

        // now we do it for a second time and the rate calculation should be re-used
        convertedCalcPromise = conversionService.convert('usd-to-eur', sheet2, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        httpBackend.expectGET('https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1').respond(200, responseUSD_EUR);
        httpBackend.flush();
        expect(sheet2.calculations.length).toBe(1);
    });


    it('verify EURtoUSD', function() {
        var sheet2 = new Sheet('id', 'foo', []);
        var convertedCalcPromise = conversionService.convert('eur-to-usd', sheet2, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        mockBackEnd();
        httpBackend.expectGET('https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1').respond(200, responseUSD_EUR);
                httpBackend.flush();
        expect(sheet2.calculations.length).toBe(1);
        var rateCalc = sheet2.calculations[0];
        expect(rateCalc.name).toBe('euro to usd rate');
        expect(rateCalc.expression).toEqual([1.2]);
        expect(rateCalc.result).toBe(1.2);
        expect(convertedCalc.result).toBeNull();
        expect(convertedCalc.expression).toEqual([calc, 'x', rateCalc ]);

        // now we do it for a second time and the rate calculation should be re-used
        convertedCalcPromise = conversionService.convert('eur-to-usd', sheet2, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        httpBackend.expectGET('https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1').respond(200, responseUSD_EUR);
        httpBackend.flush();
        expect(sheet2.calculations.length).toBe(1);
        expect(convertedCalc.expression).toEqual([calc, 'x', rateCalc]);

        // now we do it for other conversion
        convertedCalcPromise = conversionService.convert('usd-to-eur', sheet2, calc);
        convertedCalcPromise
            .then(function(returned) {
                convertedCalc = returned;
            });
        httpBackend.expectGET('https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?lastNObservations=1').respond(200, responseUSD_EUR);
        httpBackend.flush();
        expect(sheet2.calculations.length).toBe(2);
    });



});

