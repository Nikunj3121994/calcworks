'use strict';

// dit gebruikt een hele simpel storage model waarbij elke sheet zijn eigen json object heeft.

// deze service is stateful, beheerst alle sheets, stuurt events en bepaalt de active sheet.
// het nadeel is dat alle sheets in het geheugen zitten. Maar de history laat nu alle sheets met calculaties zien
// de events moeten duidelijker gedefinieerd worden.

angular.module('calcworks.services')
    .factory('sheetService', function($rootScope, $log, storageService) {

        var activeSheet = null;
        var sheets = null;

        function createSheet() {
            var sheet = new Sheet(generateUUID(), 'Untitled Sheet', []);
            return sheet;
        }

        function init() {
            sheets = storageService.loadSheets();
            // bepaal de activeSheet
            if (sheets.length === 0) {
                activeSheet = createSheet();
                sheets.push(activeSheet);
            } else {
                // check whether a 'day' has passed and we create a new sheet
                // i doubt whether this will also work when the app is passive in memory
                var midnight = new Date();
                midnight.setHours(0);
                midnight.setMinutes(0);
                if (sheets[0].updatedTimestamp.valueOf() < midnight.valueOf()) {
                    activeSheet = createSheet();
                    sheets.push(activeSheet);
                    // en als de vorige/laatste sheet nu leeg was, dan kunnen we die wel weggooien
                    // maar ja dat geldt ook voor andere sheets die leeg zijn en geen naam hebben
                } else {
                    activeSheet = sheets[0];
                }
            }
        }

        init();

        return {
            createNewActiveSheet: function() {
                // consider: als de huidige activeSheet leeg is dan kunnen we die verwijderen
                var sheet = createSheet();
                activeSheet = sheet;
                sheets.splice(0, 0, sheet);
                storageService.saveSheet(sheet);
                // we doen een generieke event ivm de save en niet alleen een specifieke 'active-sheet-changed'
                $rootScope.$broadcast("sheetsUpdated", null);
                return sheet;
            },
            getActiveSheet: function() {
                if (!activeSheet) throw new Error('no active sheet defined');
                return activeSheet;
            },
            setActiveSheet: function(sheetId) {
                if (activeSheet.id !== sheetId) {
                    activeSheet = this.getSheet(sheetId);
                    if (!activeSheet) throw new Error('sheetId ' + sheetId + ' illegal value');
                    $rootScope.$broadcast("sheetsUpdated", 'active-sheet-changed');
                }
            },
            getSheets: function() {
                return sheets;
            },
            saveSheet: function(sheet) {
                storageService.saveSheet(sheet);
            },
            getSheet: function(sheetId) {
                // kan ook op deze manier:
                // var result = sheets.filter(function(s) {
                //     return s.id === id; // filter out appropriate one
                // })[0];
                for (var i in sheets) {
                    if (sheets[i].id === sheetId) {
                        return sheets[i];
                    }
                }
                throw new Error('sheetId ' + sheetId + ' not found');
            },
            deleteSheet: function(sheetId) {
                var sheet = null;
                for (var i in sheets) {
                    if (sheets[i].id === sheetId) {
                        sheet = sheets[i];
                        sheets.splice(i,1);
                        break;
                    }
                }
                storageService.deleteSheets([sheet.id]);
                // het is nog maar de vraag of t zo handig is om altijd een nieuwe te maken
                if (sheetId === activeSheet.id) {
                    activeSheet = this.createNewActiveSheet();  // deze doet (al) een event broadcast
                }
            },
            deleteAllSheets: function(includeFavoriteSheets) {
                var flagNewActiveSheet = false;
                var sheetIds = [];
                var i = sheets.length - 1;
                while (i >= 0) {
                    if (!sheets[i].favorite || includeFavoriteSheets) {
                        sheetIds.push(sheets[i].id);
                        if (sheets[i].id === activeSheet.id) {
                            flagNewActiveSheet = true;
                        }
                        sheets.splice(i,1);
                    }
                    i = i - 1;
                }
                storageService.deleteSheets(sheetIds);
                if (flagNewActiveSheet) {
                    activeSheet = this.createNewActiveSheet();
                }
                $rootScope.$broadcast("sheetsUpdated", null);
            },
            _test_init: function() {
                init();
            }
        };
    });


