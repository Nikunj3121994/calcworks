angular.module('calcworks.controllers')


.controller('SettingsCtrl', function($scope, $ionicActionSheet, $timeout, sheetService) {

    $scope.settings = {
        enableFriends: true
    };

    $scope.deleteAllSheets = function() {
            // show ionic actionSheet to confirm delete operation
            // show() returns a function to hide the actionSheet
            var hideSheet = $ionicActionSheet.show({
                titleText: 'Are you sure that you\'d like to delete all sheets?',
                cancelText: 'Cancel',
                destructiveText: 'Delete',
                cancel: function () {
                    // do nothing
                },
                destructiveButtonClicked: function () {
                    sheetService.deleteAllSheets();
                    // hide the confirmation dialog, ik vraag me af of dit wel nodig is
                    //hideSheet();
                }
            });

        $timeout(function() {
            hideSheet();
        }, 5000);

    };

});
