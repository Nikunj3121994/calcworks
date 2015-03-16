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
        // we need to mock the storage service - for all tests (!)
        // for now delete all previous data
        sheetService.deleteAllSheets(true);

        var sheet = sheetService.getActiveSheet();
        expect(sheet.id).toBeDefined();
        expect(sheet.name).toBe('new sheet');
        expect(sheet.calculations.length).toBe(0);
        var calc = new Calculation('id', 'varname', 'dummy expression');
        sheet.add(calc);

        sheet = sheetService.getSheet(sheet.id);
        expect(sheet.calculations.length).toBe(1);

        // mock storage en dan:
        //expect(sheetService.getSheets().length).toBe(2);

    });




});

