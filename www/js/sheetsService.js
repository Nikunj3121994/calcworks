'use strict';

// dit gebruikt een hele simpel storage model waarbij alle sheets in 1 json object (key) worden opgeslagen
// het is beter om elke sheet zijn eigen json object te geven. Hierdoor worden saves efficienter.
// nadeel is wel dat het lastig kan worden om bijvoorbeeld alle sheets te deleten.
// misschien moet je de keys prefixen met een token zodat je snel kan zien wat voor soort object het is

// ook nog iets om over na te denken is: geven we een id als parameter mee of het object zelf?
// als we de sheets los opslaan is het makkelijk, dan moet je de id meegeven.

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
                sheets.splice(0, 0, sheet);
            },
            getSheets: function() {
                return sheets;
            },
            getCurrentSheet: function() {
                // consider: if sheets=[] throw exception
                return sheets[0];
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
