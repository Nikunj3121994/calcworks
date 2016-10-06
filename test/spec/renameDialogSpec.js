'use strict';

describe('Test renameDialog', function () {

    beforeEach(module('calcworks'));

    var renameDialogs, sheetService, $ionicPopup, deferred, $scope;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_renameDialogs_, _sheetService_, _$ionicPopup_, _$q_, _$rootScope_, _$httpBackend_) {
        $scope = _$rootScope_.$new();
        renameDialogs = _renameDialogs_;
        sheetService = _sheetService_;
        $ionicPopup = _$ionicPopup_;
        // angular gaat door $scope.apply de templates ophalen
        _$httpBackend_.expectGET('templates/tab-sheets.html').respond(200);
        _$httpBackend_.expectGET('templates/sheet-detail.html').respond(200);
        _$httpBackend_.expectGET('templates/tab-calculator.html').respond(200);
        _$httpBackend_.expectGET('templates/tabs.html').respond(200);
        // simuleer de ok btn
        deferred = _$q_.defer();
        spyOn($ionicPopup, 'show').and.returnValue(deferred.promise);
        sheetService.saveSheet = jasmine.createSpy("saveSheet spy");
    }));

    it('verify rename calculation', function() {
        var calc = new Calculation('id', 'calc1', []);
        var sheet = sheetService.getActiveSheet();
        sheet.addCalculation(calc);
        renameDialogs.showRenameCalculationDialog(calc, sheet);
        deferred.resolve('newcalcvalue');
        $scope.$apply();  // dit is nodig om de resolve een zetje te geven, deze gaat door de angular digest cycle
        expect(calc.name).toEqual('newcalcvalue');
        expect(sheetService.saveSheet).toHaveBeenCalled();
    });


});

