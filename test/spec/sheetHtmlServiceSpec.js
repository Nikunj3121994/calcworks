'use strict';

describe('Test sheetHtmlService', function () {

    var $log;

    beforeEach(module('calcworks'));

    var sheetHtmlService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_sheetHtmlService_, _$log_) {
        sheetHtmlService = _sheetHtmlService_;
        $log = _$log_;
    }));

    //// Log debug messages in Karma
    //afterEach(function(){
    //    console.log($log.log.logs);
    //});


    it('verify generateHtml', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', [200 , '+' , 300]);
        calc1.result = 500;
        sheet.add(calc1);
        var calc2 = new Calculation('id', 'calc2', [500, 'x', 5]);
        calc2.result = 2500;
        sheet.add(calc2);
        var html = sheetHtmlService.generateHtml(sheet);
        expect(html).toContain('<style>');
        expect(html).toContain('<table');
        console.log(html);
    });

});
