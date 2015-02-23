'use strict';

describe('Test sheetService', function () {

    beforeEach(module('calcworks'));

    var sheetService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_sheetService_) {
        sheetService = _sheetService_;
    }));

    //todo: use a mock persistence

    it('verify sheet', function() {
        sheetService.newSheet();
        expect(sheetService.getCurrentSheet().name).toBe('new sheet');
        expect(sheetService.getCurrentSheet().calculations.length).toBe(0);
        var calc = new Calculation();
        sheetService.getCurrentSheet().add(calc);
        expect(sheetService.getCurrentSheet().calculations.length).toBe(1);

        sheetService.getCurrentSheet().name = 'foo';
        expect(sheetService.getCurrentSheet().name).toBe('foo');

        sheetService.newSheet();
        expect(sheetService.getCurrentSheet().calculations.length).toBe(0);
        //expect(sheetService.getSheets().length).toBe(2);

    });




});

