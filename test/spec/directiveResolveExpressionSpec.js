'use strict';


describe('Test directives', function () {
    var element, scope, compile, httpBackend;

    beforeEach(module('calcworks'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        compile = $compile;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        element = angular.element(
            '<resolve-expression expression="expression" sheet="sheet" result="result"></resolve-expression>');

    }));

    // om onbekende redenen verwacht de mock back-end door de digest() dat een aantal html files opgehaald worden
    // ik snap niet waar dit vandaan komt.
    function mockBackEnd() {
        httpBackend.expectGET('templates/tab-sheets.html').respond(200); //mimicking the AJAX call
        httpBackend.expectGET('templates/sheet-detail.html').respond(200);
        httpBackend.expectGET('templates/tab-calculator.html').respond(200);
        httpBackend.expectGET('templates/tabs.html').respond(200);
    }

    it('verify directive', function () {
        scope.expression = [2, "+", 3];
        var calculation = new Calculation('id', 'name', scope.expression);
        calculation.result = 5;
        scope.result = 5;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var spanElement = element.find('span');
        expect(spanElement.length).toBe(4);
        expect(spanElement.eq(0).text()).toBe('2');
        expect(spanElement.eq(1).text()).toBe('+');
        expect(spanElement.eq(2).text()).toBe('3');
        expect(spanElement.eq(3).text()).toBe(' = 5');
    });

    it('verify directive', function () {
        scope.expression = [3, "-", 3];
        var calculation = new Calculation('id', 'name', scope.expression);
        calculation.result = 0;
        scope.result = 0;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var spanElement = element.find('span');
        expect(spanElement.length).toBe(4);
        expect(spanElement.eq(0).text()).toBe('3');
        expect(spanElement.eq(1).text()).toBe('-');
        expect(spanElement.eq(2).text()).toBe('3');
        expect(spanElement.eq(3).text()).toBe(' = 0');
    });

    it('verify directive with zero result', function () {
        scope.expression = [3, "-", 3];
        var calculation = new Calculation('id', 'name', scope.expression);
        calculation.result = 0;
        scope.result = 0;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var spanElement = element.find('span');
        expect(spanElement.length).toBe(4);
        expect(spanElement.eq(0).text()).toBe('3');
        expect(spanElement.eq(1).text()).toBe('-');
        expect(spanElement.eq(2).text()).toBe('3');
        expect(spanElement.eq(3).text()).toBe(' = 0');
    });

    it('verify directive without resu;t', function () {
        scope.expression = [3, "x", 3];
        var calculation = new Calculation('id', 'name', scope.expression);
        scope.result = null;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var spanElement = element.find('span');
        expect(spanElement.length).toBe(3);
    });

});
