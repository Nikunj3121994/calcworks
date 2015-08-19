'use strict';

describe('Test storageService', function () {

    beforeEach(module('calcworks'));

    var storageService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_storageService_) {
        storageService = _storageService_;
    }));

    it('verify load, save and delete sheets', function() {
        storageService._test_cleanLocalStorage();

        var sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(0);

        var sheet1 = new Sheet('id1', 'Sheet 1', []);
        var calc1 = new Calculation('id1', "calc1", []);
        sheet1.calculations.push(calc1);
        storageService.saveSheet(sheet1);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(1);
        expect(sheets[0].calculations.length).toEqual(1);

        var sheet2 = new Sheet('id2', 'Sheet 2', []);
        storageService.saveSheet(sheet2);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(2);

        storageService.deleteSheets([sheet1.id, sheet2.id]);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(0);
    });


    it('verify _sheetToJSON', function() {
        var sheet = new Sheet('id1', 'Sheet 1', []);
        var calc1 = new Calculation('idc1', "calc1", [123]);
        sheet.add(calc1);
        var json = storageService._sheetToJSON(sheet);
        expect(json).toContain('"id":"id1","name":"Sheet 1","calculations":[{"id":"idc1","varName":"calc1","expression":[123]');
        var returnedSheet = storageService._jsonToSheet(json);
        expect(returnedSheet.name).toEqual('Sheet 1');
        expect(returnedSheet.calculations.length).toEqual(1);

        var calc2 = new Calculation('idc2', "calc2", [calc1, '+', 3]);
        sheet.add(calc2);
        json = storageService._sheetToJSON(sheet);
        returnedSheet = storageService._jsonToSheet(json);
        expect(returnedSheet.name).toEqual('Sheet 1');
        expect(returnedSheet.calculations.length).toEqual(2);
        expect(returnedSheet.calculations[0].varName).toEqual('calc2');
        var returnedCalc1 = returnedSheet.calculations[1];
        expect(returnedSheet.calculations[0].expression).toEqual([returnedCalc1, '+', 3]);
    });


    it('verify load,save sheets with calculation', function() {
        storageService._test_cleanLocalStorage();

        var sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(0);

        var sheet1 = new Sheet('id1', 'Sheet 1', []);
        var calc1 = new Calculation('id1', "calc1", [123]);
        var calc2 = new Calculation('id2', "calc2", [calc1, '+', 3]);
        sheet1.calculations.push(calc1);
        sheet1.calculations.push(calc2);
        storageService.saveSheet(sheet1);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(1);
        expect(sheets[0].calculations.length).toEqual(2);
        expect(sheets[0].calculations[1].varName).toEqual('calc2');
        var newCalc1 = sheets[0].calculations[0];
        expect(sheets[0].calculations[1].expression[0]).toBe(newCalc1);
    });

    it('verify _insertSheet', function() {
        var sheet1 = new Sheet('id1', 'Sheet 1', []);
        sheet1.updatedTimestamp = new Date("October 1, 2015 11:00:00");
        var sheet2 = new Sheet('id2', 'Sheet 2', []);
        sheet2.updatedTimestamp = new Date("August 1, 2015 11:00:00");
        var sheet3 = new Sheet('id3', 'Sheet 3', []);
        sheet3.updatedTimestamp = new Date("December 1, 2015 11:00:00");
        var sheets = [];
        storageService._insertSheet(sheet1, sheets);
        expect(sheets.length).toEqual(1);
        storageService._insertSheet(sheet2, sheets);
        expect(sheets.length).toEqual(2);
        expect(sheets[0]).toEqual(sheet2);
        storageService._insertSheet(sheet3, sheets);
        expect(sheets.length).toEqual(3);
        expect(sheets[2]).toEqual(sheet3);
    });



});

