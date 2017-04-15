"use strict";

angular.module('calcworks.services')
    .service('sheetHtmlService', function ($rootScope) {
        // maybe we have to rename this service to the Share or Email Service

        this.emailSheet = function(sheet) {
            var output = this.generateHtml(sheet); // aparte var maakt debuggen in browser makkelijker
            cordova.plugins.email.open(
                {
                    subject: "email calcworks on " + sheet.name,
                    // we leave to: empty such that end-user can choose an email address
                    body: output,
                    isHtml: true
                }
            );
        };


        // this resembles for a large part the resolveSheet directive
        // not sure whether we should merge the code or keep it separate to allow for visual tweaks
        this.generateHtml = function(sheet) {
            if (!sheet) throw new Error('illegal argument sheet');
            var template = '';
            template = template + '<html>';
            template = template + '<head><style>';
            template = template + '.itemExpr{ padding-left: 2px; padding-right: 2px; }';
            template = template + '.calcNameExpr {font-size: small;position: relative;margin-left: -3px;vertical-align: super;z-index: 100;}';
            template = template + '</style></head>';
            template = template + '<table class="expressionTable">';
            for (var c = 0; c <  sheet.calculations.length; c++) {
                var calculation = sheet.calculations[c];
                var expression = calculation.expression;
                template = template + '<tr>';
                // we should add the inline width to a *separate* css class
                template = template + '<td class="itemExpr" style="width: 100px">' + $rootScope.convertNumberForRendering(calculation.result, sheet.numberDisplayOption) + '</td>';
                template = template + '<td class="itemExpr">  &nbsp;=&nbsp;  </td>';
                var arrayLength = expression.length;
                for (var i = 0; i < arrayLength; i++) {
                    template = template + '<td class="itemExpr">' + $rootScope.getExprItemForRendering(expression[i], sheet.numberDisplayOption) + '</td>';
                }
                template = template + '</tr>';
                // second row
                template = template + '<tr>';
                template = template + '<td class="calcNameExpr">' + calculation.name + '</td>';
                template = template + '<td></td>';
                for (var i = 0; i < arrayLength; i++) {
                    if (expression[i] instanceof Calculation) {
                        template = template + '<td class="calcNameExpr">' + expression[i].name + '</td>';
                    } else {
                        template = template + '<td></td>';
                    }
                }
                template = template + '</tr>';
            }
            template = template + '</table>';
            if (sheet.displayOptions.showSum) {
                template = template + '<tr>';
                template = template + '<td class="itemExpr" style="width: 100px">' + $rootScope.convertNumberForRendering(sheet.sum, sheet.numberDisplayOption) + '</td>';
                template = template + '</tr>';
                template = template + '<tr>';
                template = template + '<td class="calcNameExpr">Sum</td>';
                template = template + '</tr>';
            }
            template = template + '</html>';
            return template;
        };


});
