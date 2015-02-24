"use strict";

angular.module('calcworks.controllers')

.controller('SettingsCtrl', function($scope, $ionicPopup, $rootScope, sheetService) {

    $scope.includeFavoriteSheets = false;

    // without this explicit function you get all kinds of checkbox/angularjs issues
    $scope.toggleIncludeFavoriteSheets = function() {
        $scope.includeFavoriteSheets = !$scope.includeFavoriteSheets;
    };

    $scope.deleteAllSheets = function() {
        var templ;
        if ($scope.includeFavoriteSheets) {
            templ = 'Are you sure you want to delete all sheets - including favorites?';
        } else {
            templ = 'Are you sure you want to delete all sheets excluding favorites?';
        }
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete sheets',
            template: templ
        });
        confirmPopup.then(function(res) {
            if (res) {
                sheetService.deleteAllSheets($scope.includeFavoriteSheets);
                $rootScope.$broadcast("allSheetsDeletedEvent", null);
            }
        });
    };

});
