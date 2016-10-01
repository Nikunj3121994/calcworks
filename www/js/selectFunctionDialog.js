'use strict';


angular.module('calcworks.services')

    .factory('selectFunctionDialog', function($ionicModal) {

        return {
            showSelectFunctionDialog: function(processFunctionSelected) {

                $ionicModal.fromTemplateUrl('templates/select-function.html', {
                    scope: null,
                    animation: 'slide-in-up'
                }).then(function(modal) {

                    var closeModal = function() {
                        modal.hide();
                        modal.remove();
                    };

                    modal.scope.clickSelectFunction = function(operator) {
                        if (operator) {
                            processFunctionSelected(operator);
                        }
                        closeModal();
                    };

                    modal.show();
                });


            }

        };

});

