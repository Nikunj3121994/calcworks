"use strict";

angular.module('calcworks.controllers')

.controller('FeedbackCtrl', function($scope, $http, $rootScope, $ionicPopup) {

    $scope.feedback = { text : '' };

    $scope.sendFeedback = function() {
        console.log($scope.feedback.text);
        // e-mail adres
        // min lengte
        // todo: max lenght of 500 chars??
        // encode
        // https - ook voor die conversie web service

        var request = {
            method: 'GET',
            //url: 'https://klxuazbd4b.execute-api.us-east-1.amazonaws.com/test/pets'
            url: 'https://jk3m09hy4g.execute-api.us-east-1.amazonaws.com/prod/mail?message=' + encodeURIComponent($scope.feedback.text)
//            headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//            }
        }


        var processError = function(reason) {
            console.log('error reason' + JSON.stringify(reason));
            $rootScope.hideWaitingIcon();
            $ionicPopup.alert({
              title: 'Error occurred',
              template: 'I\'m sorry, could not sent the feedback, please try again later!'
            });

        }

        var processResponse = function(response) {
            $rootScope.hideWaitingIcon();
            $ionicPopup.alert({
              title: 'OK',
              template: 'thanks!'
            });
            $scope.feedback.text = '';
        }


        $rootScope.showWaitingIcon();
        $http(request)
            .then(processResponse, processError);
    };


});
