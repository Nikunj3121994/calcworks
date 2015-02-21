angular.module('calcworks.controllers')


.controller('SettingsCtrl', function($scope, sheetService) {

    $scope.settings = {
        enableFriends: true
    };

    $scope.deleteAllSheets = function() {
        sheetService.deleteAllSheets();
    };

});
