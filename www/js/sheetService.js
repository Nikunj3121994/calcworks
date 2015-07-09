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
            var sheet = new Sheet(generateUUID(), 'Untitled Sheet', []);
            return sheet;
        }

        // init
        var sheets = [];
        sheets = storageService.getObject('sheets');
        var activeSheet = null;
        if (angular.equals({}, sheets)) {
            sheets = [];
            activeSheet = createSheet()
            sheets.push(activeSheet);
        } else if (sheets[0].calculations.length === 0) {
            // de laatste sheet is leeg, die kunnen we weggooien en een nieuwe aanmaken
            // later kunnen we nog kijken of ie ouder als een paar uur is
            sheets.splice(0, 1);
            activeSheet = createSheet();
            sheets.splice(0, 0, activeSheet);
        } else {
            // hier kunnen we gaan controleren of het x aantal uur geleden is dat we een sheet hebben aangemaakt
            activeSheet = sheets[0];
        }

        return {
            createNewActiveSheet: function() {
                // consider: als de huidige activeSheet leeg is dan kunnen we die verwijderen
                var sheet = createSheet();
                activeSheet = sheet;
                $rootScope.$broadcast("sheetsUpdated", 'active-sheet-changed');
                sheets.splice(0, 0, sheet);
                storageService.setObject('sheets', sheets);
                $rootScope.$broadcast("sheetsUpdated", null);
                return sheet;
            },
            getActiveSheet: function() {
                if (!activeSheet) throw new Error('no active sheet defined');
                return activeSheet;
            },
            setActiveSheet: function(sheetId) {
                activeSheet = this.getSheet(sheetId);
                if (!activeSheet) throw new Error('sheetId '+ sheetId + ' illegal value');
                $rootScope.$broadcast("sheetsUpdated", 'active-sheet-changed');
            },
            getSheets: function() {
                return sheets;
            },
            saveSheets: function() {
                storageService.setObject('sheets', sheets);
            },
            getSheet: function(sheetId) {
                for (var i in sheets) {
                    if (sheets[i].id === sheetId) {
                        return sheets[i];
                    }
                }
                throw new Error('sheetId ' + sheetId + ' not found');
            },
            deleteSheet: function(sheetId) {
                for (var i in sheets) {
                    if (sheets[i].id === sheetId) {
                        sheets.splice(i,1);
                        break;
                    }
                }
                if (sheetId === activeSheet.id) {
                    activeSheet = this.createNewActiveSheet();
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
