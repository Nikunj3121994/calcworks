"use strict";

angular.module('calcworks.controllers')

    .controller('SheetsCtrl', function($scope, $ionicPopup, $timeout, sheetService) {
        $scope.sheets = sheetService.getSheets();
        $scope.showResolvedExpression = true;

        $scope.$on('allSheetsDeletedEvent', function(e, value) {
            $scope.sheets = sheetService.getSheets();
        });

        $scope.showRenamePopup = function(sheet) {
            $scope.data = {};

            // An elaborate, custom popup
            var renamePopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.name">',
                title: 'Enter name for the sheet',
                subTitle: '(Please use normal characters)',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.name;
                            }
                        }
                    }
                ]
            });
            renamePopup.then(function(res) {
                if (res) {
                    sheet.name = res;
                    sheetService.saveSheets();
                }
            });
            $timeout(function() {
                renamePopup.close(); //close the popup after 30 seconds for some reason
            }, 30000);
        };

        $scope.confirmDeleteSheet = function(sheet) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete sheet ' + sheet.name,
                template: 'Are you sure you want to delete this sheet?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    // we kunnen ook de functie aanpassen en de sheet zelf meegeven
                    sheetService.deleteSheet(sheet.id);
                    $scope.sheets= sheetService.getSheets();
                    //todo: als current sheet delete is, dan een nieuwe aanmaken
                    // misschien moet er altijd een current sheet zijn op sheetService nivo
                }
            });
        };

        $scope.toggleSheetFavorite = function(sheet) {
            sheet.favorite = !sheet.favorite;
            sheetService.saveSheets();
        };

    });