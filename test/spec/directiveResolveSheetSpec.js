'use strict';


describe('Test directives', function () {
    var element, scope, compile, httpBackend;

    beforeEach(module('calcworks'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        compile = $compile;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        element = angular.element(
            '<resolve-sheet index="0" sheet="sheet"></resolve-sheet>');

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
        var calculation = new Calculation('id', 'name', [2, "+", 3]);
        calculation.result = 5;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        scope.index = 0;
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var td = element.find('td');
        expect(td.length).toBe(10);
        expect(td.eq(0).text()).toBe('5');
        expect(td.eq(2).text()).toBe('2');
        expect(td.eq(3).text()).toBe('+');
        expect(td.eq(4).text()).toBe('3');
    });

    it('verify directive with zeros', function () {
        var calculation = new Calculation('id', 'name', [0, "+", 0]);
        calculation.result = 0;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        scope.index = 0;
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var td = element.find('td');
        expect(td.length).toBe(10);
        expect(td.eq(0).text()).toBe('0');
        expect(td.eq(2).text()).toBe('0');
        expect(td.eq(3).text()).toBe('+');
        expect(td.eq(4).text()).toBe('0');
    });

    it('verify directive with decimals', function () {
        var calculation = new Calculation('id', 'name', [2, "+", 1/3]);
        calculation.result = 5;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        scope.index = 0;
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var td = element.find('td');
        expect(td.length).toBe(10);
        expect(td.eq(0).text()).toBe('5');
        expect(td.eq(2).text()).toBe('2');
        expect(td.eq(3).text()).toBe('+');
        expect(td.eq(4).text()).toBe('0.33');
    });

    it('verify directive with percentage operator', function () {
        var calculation = new Calculation('id', 'name', [2, "%", 100]);
        calculation.result = 5;
        scope.sheet = new Sheet('id', 'name', [calculation]);
        scope.index = 0;
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        var td = element.find('td');
        expect(td.length).toBe(10);
        expect(td.eq(0).text()).toBe('5');
        expect(td.eq(2).text()).toBe('2');
        expect(td.eq(3).text()).toBe('%');
        expect(td.eq(4).text()).toBe('100');
    });


    it('verify directive with calc names', function () {
        var calc1 = new Calculation('id', 'calc1', [6, '+', 2]);
        calc1.result = 8;
        scope.sheet = new Sheet('id', 'name', [calc1]);
        var calc2 = new Calculation('id', 'calc1', [10, "-", calc1]);
        calc2.result = 2;
        scope.sheet.add(calc2);
        scope.index = 0;
        element = angular.element(
            '<resolve-sheet index="index" sheet="sheet"></resolve-sheet>');
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        //      2  =    10 - 8
        //                   calc1
        //      8  =     6 + 2
        var td = element.find('td');
        expect(td.length).toBe(10);
        expect(td.eq(0).text()).toBe('2');
        //expect(td.eq(1).text()).toBe('=');
        expect(td.eq(2).text()).toBe('10');
        expect(td.eq(3).text()).toBe('-');
        expect(td.eq(4).text()).toBe('8');
        expect(td.eq(5).text()).toBe('calc1');
        expect(td.eq(6).text()).toBe('');
        expect(td.eq(7).text()).toBe('');
        expect(td.eq(8).text()).toBe('');
        expect(td.eq(9).text()).toBe('calc1');
    });

    //todo: test result


});
