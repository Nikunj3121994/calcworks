'use strict';

describe('Test storageService', function () {

    beforeEach(module('calcworks'));

    var storageService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_storageService_) {
        storageService = _storageService_;
    }));

    it('verify loadSheets', function() {
        storageService._test_cleanLocalStorage();

        var sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(0);

        var sheet1 = new Sheet('id1', 'Sheet 1', []);
        storageService.saveSheet(sheet1);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(1);

        var sheet2 = new Sheet('id2', 'Sheet 2', []);
        storageService.saveSheet(sheet2);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(2);

        storageService.deleteSheets([sheet1.id, sheet2.id]);

        sheets = storageService.loadSheets();
        expect(sheets.length).toEqual(0);
    });




});

