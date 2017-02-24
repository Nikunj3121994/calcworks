'use strict';


angular.module('calcworks.services')

    // we zitten hier een beetje op de grens van een controller / service
    // angular staat alleen toe dat een controller een $scope krijgt, vandaar dat we een nieuwe scope moeten maken
    // het is ook netter ivm isolatie
    .factory('selectCalculationDialog', function($rootScope, $ionicModal, sheetService) {

        var selection;
        return {
            // notAllowedCalc is the calc that is under edit, can be null
            //TODO: notAllowedCalc lijkt niet te werken
            showSelectCalculationDialog: function(sheet, notAllowedCalc, processCalculationSelected) {

                $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
                    scope: $rootScope.$new(),   // we maken ivm isolatie een niewe scope
                    animation: 'slide-in-up'
                }).then(function(modal) {

                    // dit is cruciaal, zonder die 'data' container werkt het niet

                    modal.scope.data = {
                        selectedSheet : sheet,
                        availableSheets : sheetService.getSheets()
                    };
                    //todo: test of selection nog bestaat
                    //todo: betere naam
                    if (selection) {
                        modal.scope.data.selectedSheet = selection;
                    }

                    modal.scope.closeModal = function() {
                        modal.hide();
                        modal.remove();
                    };

                    // deze wordt krankzinnig vaak aangeroepen, hopelijk dat angular2 dit oplost
                    modal.scope.allowedCalcFilter = function(calc) {
                        return calc != notAllowedCalc;
                    }

                    modal.scope.clickSelectCalculation = function(calc) {
                        if (!calc) {
                            modal.scope.closeModal();
                        } else {
                            if (calc !== notAllowedCalc) {
                                selection = modal.scope.data.selectedSheet;
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

