'use strict';

describe('Test sheetDetailCtrl', function () {

    beforeEach(module('calcworks'));

    var SheetDetailCtrl,
        sheetService,
        scope,
        sheet = new Sheet('id', 'foo', []);

    var getActiveSheet = function() {
        return sheet;
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _sheetService_) {
        sheetService = _sheetService_;
        scope = $rootScope.$new();
        // we need to supply an empty sheet for each test to make sure everything is 'clean'
        sheetService.getActiveSheet = getActiveSheet;
        spyOn(sheetService, 'saveSheet');
        SheetDetailCtrl = $controller('SheetDetailCtrl', {
            $scope: scope,
            sheetService: sheetService
        });
    }));


    it('verify deleteCalculation', function() {
        var sheet1 = sheetService.getActiveSheet();
        sheet1.name = 'sheet1';
        var calc = new Calculation('id', 'calc1', []);
        sheet1.addCalculation(calc);
        scope.deleteCalculation(0);
        expect(sheetService.saveSheet).toHaveBeenCalled();
        var returnedSheet = sheetService.saveSheet.calls.argsFor(0)[0];
        expect(returnedSheet.name).toEqual('sheet1');
        expect(returnedSheet.calculations.length).toEqual(0);
    });


    it('verify reorderItem', function() {
        var sheet1 = sheetService.getActiveSheet();
        sheet1.name = 'sheet1';
        var calc1 = new Calculation('id1', 'calc1', []);
        sheet1.addCalculation(calc1);
        var calc2 = new Calculation('id2', 'calc2', []);
        sheet1.addCalculation(calc2);
        scope.reorderItem(null, 0, 1);
        expect(sheetService.saveSheet).toHaveBeenCalled();
        var returnedSheet = sheetService.saveSheet.calls.argsFor(0)[0];
        expect(returnedSheet.name).toEqual('sheet1');
        expect(returnedSheet.calculations.length).toEqual(2);
        // order is reversed (remember that items are added to top)
        expect(returnedSheet.calculations[0].name).toEqual('calc1');
        expect(returnedSheet.calculations[1].name).toEqual('calc2');
    });



});

