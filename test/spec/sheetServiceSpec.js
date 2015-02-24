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
        var sheet = sheetService.createSheet();
        expect(sheet.id).toBeUndefined();
        expect(sheet.name).toBe('new sheet');
        expect(sheet.calculations.length).toBe(0);
        var calc = new Calculation();
        sheet.add(calc);

        sheetService.addSheet(sheet);
        expect(sheet.id).toBeDefined();

        sheet = sheetService.getSheet(sheet.id);
        expect(sheet.calculations.length).toBe(1);

        // mock storage en dan:
        //expect(sheetService.getSheets().length).toBe(2);

    });




});

