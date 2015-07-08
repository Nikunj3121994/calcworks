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

        var sheet1 = sheetService.getActiveSheet();
        sheet1.name = 'sheet1';
        expect(sheet1.id).toBeDefined();
        expect(sheet1.name).toBe('sheet1');
        expect(sheet1.calculations.length).toBe(0);
        var calc = new Calculation('id', 'varname', []);
        sheet1.add(calc);

        sheet1 = sheetService.getSheet(sheet1.id);
        expect(sheet1.calculations.length).toBe(1);

        var sheet2 = sheetService.createNewActiveSheet();
        sheet2.name = 'sheet2';
        expect(sheetService.getActiveSheet().name).toEqual('sheet2');
        sheetService.setActiveSheet(sheet1.id);
        expect(sheetService.getActiveSheet().name).toEqual('sheet1');



        // mock storage en dan:
        //expect(sheetService.getSheets().length).toBe(2);

    });


    it('delete Active sheet', function() {
        expect(sheetService.getActiveSheet().name).toBe('Untitled Sheet');
        sheetService.getActiveSheet().name = 'sheet1';
        expect(sheetService.getActiveSheet().name).toBe('sheet1');
        sheetService.createNewActiveSheet();
        sheetService.getActiveSheet().name = 'sheet2';
        expect(sheetService.getActiveSheet().name).toBe('sheet2');
        sheetService.deleteSheet(sheetService.getActiveSheet().id);
        expect(sheetService.getActiveSheet().name).toBe('Untitled Sheet');
    });



});

