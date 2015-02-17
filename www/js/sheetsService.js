'use strict';

angular.module('calcworks.services')
    .factory('sheetService', function() {

        //var calculations = [];  // array of Calculation
        var currentSheet = new Sheet('new sheet', []);

        //// Some fake testing data
        //var sheets = [{
        //    id: 0,
        //    name: 'Mortgage home',
        //    notes: 'Enjoys drawing things',
        //    content: 'calc1 = 5 <br> calc2 = calc1 * 8'
        //}, {
        //    id: 1,
        //    name: 'Aflossing car',
        //    notes: 'Odd obsession with everything',
        //    content: 'calc1 = 5 <br> calc2 = calc1 * 8'
        //}, {
        //    id: 2,
        //    name: 'Cost new sofa',
        //    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
        //    content: 'calc1 = 5 <br> calc2 = calc1 * 8'
        //}, {
        //    id: 3,
        //    name: 'Salary raise',
        //    notes: 'I think he needs to buy a boat',
        //    content: 'calc1 = 5 <br> calc2 = calc1 * 8'
        //}, {
        //    id: 4,
        //    name: 'Vacation',
        //    notes: 'Just the nicest guy',
        //    content: 'calc1 = 5 <br> calc2 = calc1 * 8'
        //}];


        return {
            //all: function() {
            //    return sheets;
            //},
            //get: function(sheetId) {
            //    // Simple index lookup
            //    return sheets[sheetId];
            //},
            getCurrentSheet: function() {
                return currentSheet;
            }
        };
    });
