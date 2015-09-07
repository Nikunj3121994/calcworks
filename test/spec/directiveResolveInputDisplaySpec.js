'use strict';


describe('Test directives', function () {
    var element, scope, compile, httpBackend;

    beforeEach(module('calcworks'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        compile = $compile;
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        element = angular.element(
            '<resolve-input-display numberstr="number" ></resolve-input-display>');

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
        scope.number = '0';
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        expect(element.eq(0).text()).toBe('0');

        scope.number = '1234.99';
        compile(element)(scope);
        mockBackEnd();
        scope.$digest();
        expect(element.eq(0).text()).toBe('1,234.99');
    });


});
