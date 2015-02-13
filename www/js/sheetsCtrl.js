angular.module('calcworks.controllers')

.controller('SheetsCtrl', function($scope, sheetService) {
  $scope.sheet = sheetService.currentSheet();
})

.controller('SheetDetailCtrl', function($scope, $stateParams, Sheets) {
  $scope.sheet = Sheets.get($stateParams.sheetId);
});
