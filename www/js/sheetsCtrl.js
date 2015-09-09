"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, $ionicPlatform, $ionicPopup, $state, sheetService, sheetHtmlService, renameDialogs) {
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
            sheet.favorite = !sheet.favorite;
            sheetService.saveSheet(sheet);
        };

        $scope.shareSheet = function(sheet) {
            sheetHtmlService.emailSheet(sheet);
        };

    });