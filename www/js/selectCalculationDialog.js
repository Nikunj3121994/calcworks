'use strict';


angular.module('calcworks.services')

    // we zitten hier een beetje op de grens van een controller / service
    // angular staat alleen toe dat een controller een $scope krijgt, vandaar dat we een nieuwe scope moeten maken
    // het is ook netter ivm isolatie
    .factory('selectCalculationDialog', function($rootScope, $ionicModal, sheetService) {

        var prevSelectedSheet;
        return {

            determineSelectedSheet: function(currentSheet, prevSelectedSheet) {
                if (prevSelectedSheet) {
                    // make sure the sheet still exists
                    if (sheetService.findSheetById(prevSelectedSheet.id)) {
                        return prevSelectedSheet;
                    } else {
                        return currentSheet;
                    }
                } else {
                    return currentSheet;
                }
            },
            // notAllowedCalc is the calc that is under edit, can be null
            showSelectCalculationDialog: function(currentSheet, notAllowedCalc, processCalculationSelected) {
                var selectedSheet = this.determineSelectedSheet(currentSheet, prevSelectedSheet);
                $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
                    scope: $rootScope.$new(),   // we maken ivm isolatie een niewe scope
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    // note that the 'data' container is needed to make mvc work
                    modal.scope.data = {
                        selectedSheet : selectedSheet,
                        availableSheets : sheetService.getSheets()
                    };

                    modal.scope.closeModal = function() {
                        modal.hide();
                        modal.remove();
                    };

                    // deze wordt krankzinnig vaak aangeroepen, hopelijk dat angular2 dit oplost
                    modal.scope.allowedCalcFilter = function(calc) {
                        return calc != notAllowedCalc;
                    };

                    modal.scope.clickSelectCalculation = function(calc) {
                        if (!calc) {
                            modal.scope.closeModal();
                        } else {
                            if (calc !== notAllowedCalc) {
                                prevSelectedSheet = modal.scope.data.selectedSheet;
                                processCalculationSelected(calc, modal.scope.data.selectedSheet);
                                modal.scope.closeModal();
                            }
                        }
                    };

                    modal.show();
                });


            }

        };

});

