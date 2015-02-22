angular.module('calcworks.controllers')


.controller('SettingsCtrl', function($scope, $ionicPopup, $rootScope, sheetService) {


    $scope.deleteAllSheets = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete all sheets',
            template: 'Are you sure you want to delete all sheets?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                sheetService.deleteAllSheets();
                $rootScope.$broadcast("allSheetsDeletedEvent", null);
            }
        });
    };

});
