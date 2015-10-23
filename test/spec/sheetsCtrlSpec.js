'use strict';

describe('Test sheetsCtrl', function () {

    beforeEach(module('calcworks'));

    var SheetsCtrl,
        scope,
        sheetService,
        sheets = [];

    var getSheets = function() {
        return sheets;
    }

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _sheetService_) {
        sheetService = _sheetService_;
        scope = $rootScope.$new();
        // we need to supply an empty set of sheets for each test to make sure everything is 'clean'
        sheetService.getSheets = getSheets;
        //spyOn(sheetService, 'saveSheet');
        SheetsCtrl = $controller('SheetsCtrl', {
            $scope: scope,
            sheetService: sheetService
        });
    }));


    it('verify favorite toggle', function() {
        var sheet1 = new Sheet('id', 'name', []);
        sheets.push(sheet1);
        scope.toggleSheetFavorite(sheet1);
        expect(sheet1.favorite).toBeTruthy();

        scope.toggleSheetFavorite(sheet1);
        expect(sheet1.favorite).toBeFalsy();
    });


    it('verify max favorites', function() {
        var sheet1 = new Sheet('id', 'name', []);
        sheet1.favorite = true;

        sheetService.maxFavoritesReached = function() {
            return true;
        }

        // you can turn it off
        scope.toggleSheetFavorite(sheet1);
        expect(sheet1.favorite).toBeFalsy();
        // but you cannot turn it on
        scope.toggleSheetFavorite(sheet1);
        expect(sheet1.favorite).toBeFalsy();
    });



});

