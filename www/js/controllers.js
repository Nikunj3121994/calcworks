angular.module('calcworks.controllers')

.controller('SheetsCtrl', function($scope, Sheets) {
  $scope.sheets = Sheets.all();
})

.controller('SheetDetailCtrl', function($scope, $stateParams, Sheets) {
  $scope.sheet = Sheets.get($stateParams.sheetId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
