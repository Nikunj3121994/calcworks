'use strict';


angular.module('calcworks.services')

    .factory('configureMacroDialog', function($ionicModal, sheetService) {

        return {
            showConfigureMacroDialog: function(sheet) {

                $ionicModal.fromTemplateUrl('templates/configure-macro.html', {
                    scope: null,
                    animation: 'slide-in-up'
                }).then(function(modal) {

                    var closeModal = function() {
                        modal.hide();
                        modal.remove();
                    };

                    modal.scope.clickCalculation = function(calc) {
                        if (calc) {
                            if (modal.scope.mode === 'input') {
                                // deselect
                                if (modal.scope.inputCalculation === calc) {
                                    modal.scope.inputCalculation = null;
                                } else {
                                    if (calc === modal.scope.outputCalculation) {
                                        // todo error signal since output and input are not allowed to be the same
                                    } else {
                                        modal.scope.inputCalculation = calc;
                                    }
                                }
                                modal.scope.toggleInputOutput();
                            } else {
                                if (modal.scope.outputCalculation === calc) {
                                    modal.scope.outputCalculation = null;
                                } else {
                                    if (calc === modal.scope.inputCalculation) {
                                        // todo error signal since output and input are not allowed to be the same
                                    } else {
                                        modal.scope.outputCalculation = calc;
                                    }
                                }
                            }
                        } else {
                            // close
                            modal.scope.sheet.inputCalculation = modal.scope.inputCalculation;
                            modal.scope.sheet.outputCalculation = modal.scope.outputCalculation;
                            sheetService.saveSheet(modal.scope.sheet);
                            closeModal();
                        }
                    };

                    modal.scope.selected = function(calc) {
                        if (modal.scope.mode === 'input') {
                            return calc === modal.scope.inputCalculation;
                        } else {
                            return calc === modal.scope.outputCalculation;
                        }
                    };

                    modal.scope.isInputCalc = function(calc) {
                        return calc === modal.scope.inputCalculation;
                    };

                    modal.scope.isOutputCalc = function(calc) {
                        return calc === modal.scope.outputCalculation;
                    };

                    modal.scope.toggleInputOutput = function() {
                        if (modal.scope.mode === 'input') {
                            modal.scope.mode = 'output';
                        } else {
                            modal.scope.mode = 'input';
                        }
                    };

                    modal.scope.sheet = sheet;
                    modal.scope.mode = 'input';
                    modal.scope.inputCalculation =  modal.scope.sheet.inputCalculation;
                    modal.scope.outputCalculation =  modal.scope.sheet.outputCalculation;
                    modal.show();
                });


            }

        };

});

