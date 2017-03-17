'use strict';

describe('Test sheetHtmlService', function () {

    var $log;

    beforeEach(module('calcworks'));

    var sheetHtmlService;

    // the underscore at both sides is a convention by AngularJS to get the right service
    beforeEach(inject(function (_sheetHtmlService_) {
        sheetHtmlService = _sheetHtmlService_;
    }));



    it('verify generateHtml', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', [200 , '+' , 300]);
        calc1.result = 500;
        sheet.addCalculation(calc1);
        var calc2 = new Calculation('id', 'calc2', [500, 'x', 5]);
        calc2.result = 2500;
        sheet.addCalculation(calc2);
        var html = sheetHtmlService.generateHtml(sheet);
        expect(html).toContain('<style>');
        expect(html).toContain('<table');
        expect(html).toContain('200');
        expect(html).toContain('2,500');
        //console.log(html);
    });

    it('verify generateHtml with sum', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', [200 , '+' , 300]);
        calc1.result = 500;
        sheet.addCalculation(calc1);
        sheet.displayOption.showSum = true;
        sheet.sum = 1000;
        var html = sheetHtmlService.generateHtml(sheet);
        expect(html).toContain('<style>');
        expect(html).toContain('<table');
        expect(html).toContain('Sum');
        expect(html).toContain('1,000');
    });


    it('verify generateHtml with decimals', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', [2.12 , '+' , 3]);
        calc1.result = 5.00; // invalid for testing purposes
        sheet.addCalculation(calc1);
        sheet.displayOption.showSum = true;
        sheet.sum = 10;

        var html = sheetHtmlService.generateHtml(sheet);
        expect(html).toContain('2.12');
        expect(html).toContain('3');
        expect(html).toContain('5');
        expect(html).toContain('10');

        sheet.numberDisplayOption.minimumFractionDigits = 2;
        var html = sheetHtmlService.generateHtml(sheet);
        expect(html).toContain('2.12');
        expect(html).toContain('3.00');
        expect(html).toContain('5.00');
        expect(html).toContain('10.00');
    });


    it('verify generateHtml plusMin', function() {
        var sheet = new Sheet('id', 'foo', []);
        var calc1 = new Calculation('id', 'calc1', [200 , '%' , 3]);
        calc1.result = 6;
        sheet.addCalculation(calc1);
        var calc2 = new Calculation('id', 'calc2', [500, 'x', '_', 5]);
        calc2.result = -2500;
        sheet.addCalculation(calc2);
        var html = sheetHtmlService.generateHtml(sheet);
        expect(html).toContain('<style>');
        expect(html).toContain('<table');
        expect(html).toContain('200');
        expect(html).toContain('2,500');
    });


});
