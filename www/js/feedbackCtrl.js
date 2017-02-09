"use strict";

angular.module('calcworks.controllers')

.controller('FeedbackCtrl', function($scope, $http, $rootScope, $timeout, $ionicPopup) {

    $scope.feedback = { text : '' };
    $scope.showButton = true;
    $scope.showOkMessage = false;
    $scope.showErrorMessage = false;

    $scope.sendFeedback = function() {

        // note: max lenght is defined in html / textarea

        var request = {
            method: 'GET',
            url: 'https://jk3m09hy4g.execute-api.us-east-1.amazonaws.com/prod/mail?message=' + encodeURIComponent($scope.feedback.text)
        }


        var processError = function(response) {
            $scope.showSendingMessage = false;
            $scope.showErrorMessage = true;
            hideMessage();
        }

        var processResponse = function(response) {
            $scope.showSendingMessage = false;
            $scope.showOkMessage = true;
            hideMessage();
        }

        var hideMessage = function() {
            $timeout(function () {
                $scope.showErrorMessage = false;
                $scope.showOkMessage = false;
                $scope.showSendingMessage = false;
                $scope.showButton = true;
                $scope.feedback.text = '';
            }, 2000);
        }

        $scope.showSendingMessage = true;
        $scope.showButton = false;
        $http(request)
            .then(processResponse, processError);
    };


});
