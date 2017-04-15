'use strict';

describe('Test renameDialog', function () {

    beforeEach(module('calcworks'));

    var selectCalculationDialog, sheetService, $scope;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_selectCalculationDialog_, _sheetService_, _$rootScope_, _$httpBackend_) {
        $scope = _$rootScope_.$new();
        selectCalculationDialog = _selectCalculationDialog_;
        sheetService = _sheetService_;
    }));

    it('verify determine selected sheet', function() {
        var calc = new Calculation('id', 'calc1', []);
        var sheet = sheetService.getActiveSheet();
        sheet.addCalculation(calc);
        var selectedSheet = selectCalculationDialog.determineSelectedSheet(sheet, null);
        expect(selectedSheet).toEqual(sheet);

        var newSheet = sheetService.createNewActiveSheet();
        var selectedSheet = selectCalculationDialog.determineSelectedSheet(newSheet, null);
        expect(selectedSheet).toEqual(newSheet);

        var selectedSheet = selectCalculationDialog.determineSelectedSheet(newSheet, sheet);
        expect(selectedSheet).toEqual(sheet);

        sheetService.deleteSheet(sheet.id);
        var selectedSheet = selectCalculationDialog.determineSelectedSheet(newSheet, sheet);
        expect(selectedSheet).toEqual(newSheet);

    });


});

