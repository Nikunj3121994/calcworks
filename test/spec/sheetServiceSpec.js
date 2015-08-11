'use strict';

describe('Test sheetService', function () {

    beforeEach(module('calcworks'));

    var sheetService, storageService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_sheetService_, _storageService_) {
        sheetService = _sheetService_;
        storageService = _storageService_;
        // use a mock persistence
        storageService.saveSheet = function(sheet) {};
        storageService.loadSheets = function() { return [] };
        // we need to re-initialize to load sheets with the mock
        sheetService._test_init();
    }));


    it('verify sheet', function() {
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

    it('delete all sheets', function() {
        var sheet1 = sheetService.createNewActiveSheet();
        sheet1.name = 'sheet1';
        var sheet2 = sheetService.createNewActiveSheet();
        sheet2.name = 'sheet2';
        sheet2.favorite = true;
        var sheet3 = sheetService.createNewActiveSheet();
        sheet3.name = 'sheet3';
        storageService.loadSheets = function() { return [sheet1, sheet2, sheet3] };
        // we need to re-initialize to load sheets with the mock
        sheetService._test_init();

        sheetService.setActiveSheet(sheet2.id);
        expect(sheetService.getActiveSheet().name).toEqual('sheet2');
        spyOn(storageService, 'deleteSheets');
        sheetService.deleteAllSheets(false);
        expect(storageService.deleteSheets.calls.count()).toEqual(1);
        var arg = storageService.deleteSheets.calls.argsFor(0);
        // het eerste argument moet een array zijn met 2 sheets erin
        expect(arg[0].length).toEqual(2);
        // test ook dat sheets idd 2 minder heeft
        expect(sheetService.getSheets().length).toEqual(1);
        expect(sheetService.getActiveSheet().name).toEqual('sheet2');

        // nu alle sheets verwijderen
        sheetService._test_init();
        sheetService.deleteAllSheets(true);
        expect(storageService.deleteSheets.calls.count()).toEqual(2);
        var arg = storageService.deleteSheets.calls.argsFor(1);
        // het eerste argument moet een array zijn met 3 sheets erin
        expect(arg[0].length).toEqual(3);
        // test ook dat sheets idd alleen een nieuwe active sheet heeft
        expect(sheetService.getSheets().length).toEqual(1);
        expect(sheetService.getSheets()[0].name).toEqual('Untitled Sheet');

        // test zonder favorites
        sheet2.favorite = false;
        sheetService._test_init();
        expect(sheetService.getSheets().length).toEqual(3);
        sheetService.setActiveSheet(sheet1.id);
        sheetService.deleteAllSheets(false);
        expect(storageService.deleteSheets.calls.count()).toEqual(3);
        var arg = storageService.deleteSheets.calls.argsFor(2);
        // het eerste argument moet een array zijn met 3 sheets erin
        expect(arg[0].length).toEqual(3);
        // test ook dat sheets idd leeg is
        expect(sheetService.getSheets().length).toEqual(1);
        expect(sheetService.getSheets()[0].name).toEqual('Untitled Sheet');

    });

});

