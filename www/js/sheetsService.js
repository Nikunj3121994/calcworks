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
            },
            deleteSheet: function(id) {
                for (var i in sheets) {
                    if (sheets[i].id === id) {
                        sheets.splice(i,1);
                        break;
                    }
                }
                storageService.setObject('sheets', sheets);

                // in the future:
                //storageService.removeItem(key);

            }
        };
    });



// voor als we nog een keer moeten zoeken in de array of sheets:
// var result = sheets.filter(function(s) {
//     return s.id === id; // filter out appropriate one
// })[0];
