'use strict';

angular.module('calcworks.services')
    .factory('sheetService', function(storageService) {

        //var currentSheet = new Sheet('new sheet', []);
        var sheets = null;
        sheets = storageService.getObject('sheets');
        if (angular.equals({}, sheets)) {
            sheets = [];
        }

        return {
            newSheet: function() {
                var sheet = new Sheet('new sheet', []);
                sheets.push(sheet);
            },
            getSheets: function() {
                return sheets;
            },
            getCurrentSheet: function() {
                return sheets[sheets.length-1];
            },
            saveSheets: function() {
                storageService.setObject('sheets', sheets);
            }
        };
    });
