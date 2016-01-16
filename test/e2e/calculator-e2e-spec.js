// instructions:
// 1) start webdriver:                           $ webdriver-manager start
// 2) run the protractor tests from /test/e2e:   $ protractor conf.js


'use strict';


var pageobjects = require('./calculator-pageobjects.js');

describe('calculator', function() {



  beforeEach(function() {
    browser.get('http://localhost:8100/');
  });


  it('very simple calculation  1 + 2 = 3', function() {
    var calculatorTab = new pageobjects.CalculatorTab();
    expect(calculatorTab.getDisplay()).toEqual('0');

    calculatorTab.clickBtn1();
    expect(calculatorTab.getDisplay()).toEqual('1');

    calculatorTab.clickBtnPlus();
    calculatorTab.clickBtn2();
    calculatorTab.clickBtnEquals();

    expect(calculatorTab.getDisplay()).toEqual('3');
    expect(calculatorTab.getExpression()).toEqual('1+2 = 3');
  });


  it('simple calculation with separators  100,000 + 2,1 = 100,002.1', function() {
    var calculatorTab = new pageobjects.CalculatorTab();
    calculatorTab.clickBtnClear();
    expect(calculatorTab.getDisplay()).toEqual('0');

    calculatorTab.clickBtn1();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    expect(calculatorTab.getDisplay()).toEqual('100,000');

    calculatorTab.clickBtnPlus();
    calculatorTab.clickBtn2();
    calculatorTab.clickBtnDecimalSeparator();
    calculatorTab.clickBtn1();
    calculatorTab.clickBtnEquals();

    expect(calculatorTab.getDisplay()).toEqual('100,002.1');
  });


  it('simple calculation with name', function() {
    var calculatorTab = new pageobjects.CalculatorTab();
    calculatorTab.clickBtnClear();
    expect(calculatorTab.getDisplay()).toEqual('0');

    calculatorTab.clickBtn1();
    calculatorTab.clickBtnPlus();
    calculatorTab.clickBtn2();
    calculatorTab.clickBtnEquals();
    expect(calculatorTab.getDisplay()).toEqual('3');

    calculatorTab.clickPin();

    var nameDialog = new pageobjects.RenameDialog();
    nameDialog.giveName('testname');

    var activeSheetTab = new pageobjects.ActiveSheetTab();
    activeSheetTab.gotoTab();
    expect(activeSheetTab.getFirstCalc()).toBe('testname');
    expect(activeSheetTab.getNumberOfCalcs()).toBe(3);

    var historyTab = new pageobjects.HistoryTab();
    historyTab.gotoTab();
    expect(historyTab.getFirstSheetName()).toBe('Untitled Sheet (active)');
    expect(historyTab.getFirstSheetFirstCalcName()).toBe('testname');
  });




});
