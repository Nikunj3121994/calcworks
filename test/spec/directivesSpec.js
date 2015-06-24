'use strict';


describe('Test directives', function () {
    var element, scope, compile, httpBackend;

    beforeEach(module('calcworks'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        compile = $compile;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        scope.sheet = new Sheet('id', 'name', [scope.expression]);
        element = angular.element(
            '<resolve-expression expression="expression" sheet="sheet"></resolve-expression>');

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
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var span = element.find('span');
        expect(span.length).toBe(3);
        expect(span.eq(0).text()).toBe('2');
        expect(span.eq(1).text()).toBe('+');
        expect(span.eq(2).text()).toBe('3');
    });

    it('verify directive with decimals', function () {
        scope.expression = [2, "+", 1/3];
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var span = element.find('span');
        expect(span.length).toBe(3);
        expect(span.eq(0).text()).toBe('2');
        expect(span.eq(1).text()).toBe('+');
        expect(span.eq(2).text()).toBe('0.33');
    });

    it('verify directive with percentage operator', function () {
        scope.expression = [2, "%", 1000];
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var span = element.find('span');
        expect(span.length).toBe(3);
        expect(span.eq(0).text()).toBe('2');
        expect(span.eq(1).text()).toBe('%');
        expect(span.eq(2).text()).toBe('1000');
    });


    it('verify directive with calc names', function () {
        var calculation = new Calculation('id', 'calc1', '6 + 2');
        calculation.result = 8;
        scope.sheet.add(calculation);
        scope.expression = [4, "-", "calc1"];
        scope.showcalcname = true;
        element = angular.element(
            '<resolve-expression expression="expression" sheet="sheet" showcalcname="showcalcname"></resolve-expression>');
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var span = element.find('span');
        expect(span.length).toBe(4);
        expect(span.eq(0).text()).toBe('4');
        expect(span.eq(1).text()).toBe('-');
        expect(span.eq(2).text()).toBe('8');
        expect(span.eq(3).text()).toBe('calc1');
    });

    //todo: test result


});
