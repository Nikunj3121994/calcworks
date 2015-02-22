'use strict';

angular.module('calcworks.services')
    .factory('sheetService', function(storageService) {

        // init
        var sheets = [];
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
                // if sheets=[] throw exception
                return sheets[sheets.length-1];
            },
            saveSheets: function() {
                storageService.setObject('sheets', sheets);
            },
            getSheet: function(id) {
                for (var i in sheets) {
                    if (sheets[i].id === id) {
                        return sheets[i];
                    }
                }
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

            },
            deleteAllSheets: function() {
                storageService.deleteObject('sheets');
                sheets = [];
            }
        };
    });



// voor als we nog een keer moeten zoeken in de array of sheets:
// var result = sheets.filter(function(s) {
//     return s.id === id; // filter out appropriate one
// })[0];
