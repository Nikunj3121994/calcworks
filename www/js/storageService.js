'use strict';

angular.module('calcworks.services')
    .factory('storageService', ['$window', '$log', function($window, $log) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            //setObject: function(key, value) {
            //    $window.localStorage[key] = JSON.stringify(value);
            //},
            //getObject: function(key) {
            //    return this._jsonToSheet($window.localStorage[key] || '{}');
            //},
            //deleteObject: function(key) {
            //    $window.localStorage.removeItem(key);
            //},

            //todo: make sure order is preserved
            loadSheets: function() {
                var sheets = [];
                // for now we assume that only sheets are stored
                // if we store other objects then we need to prefix the id with a type identifier to separate the sheets
                // or store the sheet ids in a json object with a hard coded key, we can also preserve the order of sheets
                for (var i = 0, len = localStorage.length; i < len; ++i ) {
                    var sheet = this._jsonToSheet($window.localStorage[localStorage.key(i)] || '{}');
                    // verify valid and in the future we can update the object if it is from an older version
                    if (sheet.version === '1.0') {
                        this._insertSheet(sheet, sheets);
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

            // added to interface so we can test, the underscore indicates private usage

            _insertSheet: function(sheet, sheets) {
                sheets.push(sheet);
            },

            _jsonToSheet: function(json) {
                var objects = JSON.parse(json,
                    // http://stackoverflow.com/questions/12975430/custom-object-to-json-then-back-to-a-custom-object
                    function(key, val) {
                        //$log.log('deserialize: ' + val);
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
                for (var i = 0, len = localStorage.length; i < len; ++i ) {
                    $window.localStorage.removeItem(localStorage.key(i));
                }
            }

        };
    }]);