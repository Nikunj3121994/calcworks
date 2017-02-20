"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, $ionicPopup, $state, sheetService, sheetHtmlService, renameDialogs) {
        $scope.sheets = sheetService.getSheets();

        $scope.$on('sheetsUpdated', function(e, value) {
            $scope.sheets = sheetService.getSheets();
        });

        $scope.gotoSheet = function(sheet) {
            $state.go('tab.active-sheet', { sheetId: sheet.id});
        };

        $scope.getActiveSheetId = function() {
            return sheetService.getActiveSheet().id;
        };

        $scope.showRenamePopup = function(sheet) {
            renameDialogs.showRenameSheetDialog(sheet);
        };

        $scope.confirmDeleteSheet = function(sheet) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete sheet',
                template: 'Delete sheet ' + sheet.name + '?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    sheetService.deleteSheet(sheet.id);
                    $scope.sheets = sheetService.getSheets();
                }
            });
        };

        $scope.toggleSheetFavorite = function(sheet) {
            if (sheet.favorite) {
                sheet.favorite = false;
                sheetService.saveSheet(sheet);
            } else if (!sheetService.maxFavoritesReached()) {
                // a favorite sheet must have a name for later use (selection)
                if (sheet.name == sheet.defaultName) {
                    renameDialogs.showRenameSheetDialog(sheet);
                }
                sheet.favorite = true;
                sheetService.saveSheet(sheet);
            } else {
                var alertPopup = $ionicPopup.alert({
                     title: 'Max number of favorites reached',
                     template: 'Please contact me if you need more favorites - use the Feedback shown below.'
                   });
                alertPopup.then(function(res) {
                });
            }
        };

        $scope.shareSheet = function(sheet) {
            sheetHtmlService.emailSheet(sheet);
        };

    });