'use strict';

// dit gebruikt een hele simpel storage model waarbij alle sheets in 1 json object (key) worden opgeslagen
// het is beter om elke sheet zijn eigen json object te geven. Hierdoor worden saves efficienter.
// nadeel is wel dat het lastig kan worden om bijvoorbeeld alle sheets te deleten.
// misschien moet je de keys prefixen met een token zodat je snel kan zien wat voor soort object het is

// ook nog iets om over na te denken is: geven we een id als parameter mee of het object zelf?
// als we de sheets los opslaan is het makkelijk, dan moet je de id meegeven.

angular.module('calcworks.services')
    .factory('sheetService', function($rootScope, $log, storageService) {

        function createSheet() {
            // we do not set id, id used as flag if sheet is persisted
            var sheet = new Sheet('new sheet', []);
            sheet.id = ionic.Utils.nextUid(); // ionic util
            return sheet;
        }

        // init
        var sheets = [];
        var activeSheetIndex = 0;  // is a const, always 0.
        sheets = storageService.getObject('sheets');
        if (angular.equals({}, sheets)) {
            sheets = [];
            sheets.push(createSheet());
        }

        return {
            createNewActiveSheet: function() {
                sheets.splice(0, 0, createSheet());
                storageService.setObject('sheets', sheets);
            },
            getActiveSheet: function() {
                $log.log('info: getActiveSheet called');
                var sheet = sheets[activeSheetIndex];
                if (! (sheet instanceof Sheet)) throw 'internal error, sheet is wrong type!';
                return sheet;
            },
            getSheets: function() {
                return sheets;
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
                        // todo:  throw exception if activeSheet is deleted
                        sheets.splice(i,1);
                        break;
                    }
                }
                storageService.setObject('sheets', sheets);

                // in the future:
                //storageService.removeItem(key);

            },
            deleteAllSheets: function(includeFavoriteSheets) {
                if (includeFavoriteSheets) {
                    storageService.deleteObject('sheets');
                    sheets = [];
                } else {
                    sheets = sheets.filter(function(sheet) {
                        return sheet.favorite;
                    });
                }
                this.createNewActiveSheet();
                storageService.setObject('sheets', sheets);
                // we zouden in de tweede parameter meer info kunnen stoppen, bijvoorbeeld 'all' of de index van
                // welke sheet is aangepast.
                $rootScope.$broadcast("sheetsUpdated", null);
            }
        };
    });



// voor als we nog een keer moeten zoeken in de array of sheets:
// var result = sheets.filter(function(s) {
//     return s.id === id; // filter out appropriate one
// })[0];
