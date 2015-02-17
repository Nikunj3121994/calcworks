'use strict';

describe('Test sheetService', function () {

    beforeEach(module('calcworks'));

    var sheetService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_sheetService_) {
        sheetService = _sheetService_;
    }));

    it('verify sheet', function() {
        expect(sheetService.getCurrentSheet().calculations.length).toBe(0);
        var calc = new Calculation();
        sheetService.getCurrentSheet().add(calc);
        expect(sheetService.getCurrentSheet().calculations.length).toBe(1);
    });




});

