'use strict';

angular.module('calcworks.services')
    .factory('storageService', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}',
                    // http://stackoverflow.com/questions/12975430/custom-object-to-json-then-back-to-a-custom-object
                    function(key, val) {
                        console.log('deserialize: ' + val);
                        if (val && typeof(val) === 'object' && val.__type === 'Sheet') {
                            return new Sheet(val);
                        }
                        if (val && typeof(val) === 'object' && val.__type === 'Calculation') {
                            return new Calculation(val);
                        }
                        return val;
                    }
                    );
            },
            deleteObject: function(key) {
                $window.localStorage.removeItem(key);
            }
        };
    }]);