'use strict';

angular.module('calcworks.services')
    .factory('storageService', ['$window', function($window) {
        return {

            loadSheets: function() {
                var sheets = [];
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() - 30);

                // for now we assume that only sheets are stored
                // if we store other objects then we need to prefix the id with a type identifier to separate the sheets
                // or store the sheet ids in a json object with a hard coded key, we can also preserve the order of sheets
                var len = $window.localStorage.length;
                for (var i = 0; i < len; ++i ) {
                    var key = $window.localStorage.key(i);
                    var value = $window.localStorage[key];
                    // it seems that undefined is returned as string
                    if (value && value != 'undefined') {
                        var sheet = this._jsonToSheet(value);
                        // verify valid and in the future we can update the object if it is from an older version
                        if (sheet.version === '1.0') {
                            // if a sheet is no longer 'useful' we delete it
                            if (this._usefulSheet(sheet, expireDate)) {
                                this._insertSheet(sheet, sheets);
                            } else {
                                $window.localStorage.removeItem(key);
                            }
                        }
                    }
                }
                return sheets;
            },

            saveSheet: function(sheet) {
                sheet.updatedTimestamp = new Date();
                $window.localStorage[sheet.id] = this._sheetToJSON(sheet);
            },

            deleteSheets: function(sheetIds) {
                for ( var i = 0, len = sheetIds.length; i < len; ++i ) {
                    $window.localStorage.removeItem(sheetIds[i]);
                }
            },

            // added methods to interface so we can test, the underscore indicates private usage

            // een sheet is useful als ie favorite is, minder dan 30 dagen geleden bewerkt en niet leeg
            _usefulSheet: function(sheet, expireDate) {
                return (sheet.createdTimestamp.valueOf() !== sheet.updatedTimestamp.valueOf())
                && (sheet.favorite || (sheet.updatedTimestamp.valueOf() > expireDate.valueOf()));
            },

            // add most recent update sheet to top
            _insertSheet: function(sheet, sheets) {
                for (var i = 0, len = sheets.length; i < len; ++i ) {
                    if (sheet.updatedTimestamp > sheets[i].updatedTimestamp) {
                        sheets.splice(i, 0, sheet);
                        return;
                    }
                }
                sheets.push(sheet);
            },

            _jsonToSheet: function(json) {
                var objects = JSON.parse(json,
                    // http://stackoverflow.com/questions/12975430/custom-object-to-json-then-back-to-a-custom-object
                    function(key, val) {
                        if (val && typeof(val) === 'object' && val.__type === 'Sheet') {
                            return new Sheet(val);
                        }
                        if (val && typeof(val) === 'object' && val.__type === 'Calculation') {
                            return new Calculation(val);
                        }
                        return val;
                    }
                );
                return JSON.retrocycle(objects);
            },

            _sheetToJSON: function(sheet) {
                return JSON.stringify(JSON.decycle(sheet));
            },

            // for testing purposes only
            _test_cleanLocalStorage: function() {
                var len = $window.localStorage.length;
                for (var i = len - 1 ; i >= 0; --i ) {
                    $window.localStorage.removeItem($window.localStorage.key(i));
                }
            }

        };
    }]);