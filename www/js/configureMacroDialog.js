'use strict';


angular.module('calcworks.services')

    .factory('configureMacroDialog', function($ionicModal, sheetService) {

        return {
            showConfigureMacroDialog: function(sheet) {

                var modalDlg;

                $ionicModal.fromTemplateUrl('templates/configure-macro.html', {
                    scope: null,
                    animation: 'slide-in-up'
                }).then(function(modal) {

                    modalDlg = modal;

                    var closeModal = function() {
                        modalDlg.hide();
                        modalDlg.remove();
                    };
                    var selectCalculationModalClicked = function(calc) {
                        if (calc) {
                            if (modal.scope.mode === 'input') {
                                modal.scope.inputCalculation = calc;
                            } else {
                                modal.scope.outputCalculation = calc;
                            }
                            modal.scope.toggleInputOutput();
                            if (modal.scope.inputCalculation && modal.scope.outputCalculation) {
                                modal.scope.sheet.inputCalculation = modal.scope.inputCalculation;
                                modal.scope.sheet.outputCalculation = modal.scope.outputCalculation;
                                sheetService.saveSheet(modal.scope.sheet);
                                closeModal();
                            }
                        } else {
                            // cancel
                            closeModal();
                        }
                    }

                    modal.scope.mode = 'input';
                    modal.scope.inputCalculation = undefined;
                    modal.scope.outputCalculation = undefined;
                    modal.scope.sheet = undefined; // defined in showMacroPopup
                    modal.scope.clickCalculation = selectCalculationModalClicked;
                    modal.scope.clickClear = function() {
                        modal.scope.inputCalculation = undefined;
                        modal.scope.outputCalculation = undefined;
                    };
                    modal.scope.toggleInputOutput = function() {
                        if (modal.scope.mode === 'input') {
                            modal.scope.mode = 'result';
                        } else {
                            modal.scope.mode = 'input';
                        }
                    };

                    modalDlg.scope.sheet = sheet;
                    modalDlg.show();
                });


            }

        };

});

