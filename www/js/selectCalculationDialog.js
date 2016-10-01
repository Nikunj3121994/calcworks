'use strict';


angular.module('calcworks.services')

    .factory('selectCalculationDialog', function($ionicModal) {

        return {
            // notAllowedCalc is the calc that is under edit, can be null
            showSelectCalculationDialog: function(sheet, notAllowedCalc, processCalculationSelected) {

                $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
                    scope: null,
                    animation: 'slide-in-up'
                }).then(function(modal) {

                    modal.scope.sheet = sheet;
                    modal.scope.notAllowedCalc = notAllowedCalc

                    var closeModal = function() {
                        modal.hide();
                        modal.remove();
                    };

                    modal.scope.clickSelectCalculation = function(calc) {
                        if (!calc) {
                            // cancel clicked
                            closeModal();
                        } else {
                            if (calc !== notAllowedCalc) {
                                processCalculationSelected(calc);
                                closeModal();
                            }
                        }
                    };

                    modal.show();
                });


            }

        };

});

