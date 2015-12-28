"use strict";

angular.module('calcworks.controllers')

.controller('SettingsCtrl', function($scope, $ionicPopup, sheetService) {

    // the parent object is needed to let ion-toggle function correctly
    $scope.settings = { includeFavoriteSheets : false} ;
    $scope.feedback = '';


    $scope.deleteAllSheets = function() {
        var templ;
        if ($scope.settings.includeFavoriteSheets) {
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
            }
        });
    };

    $scope.sendFeedback = function() {
        cordova.plugins.email.open(
            {
                subject: "feedback calcgems",
                to: 'calculatorgems@gmail.com',
            },
            function () {
                //console.log('email view dismissed');
            },
            this
        );
    };


});
