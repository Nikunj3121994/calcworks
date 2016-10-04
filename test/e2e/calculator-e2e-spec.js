

// instructions:
// 1) start webdriver:                           $ webdriver-manager start
// 2) run the protractor tests from /test/e2e:   $ protractor conf.js

'use strict';


var pageobjects = require('./calculator-pageobjects.js');

describe('calculator', function() {



  beforeEach(function() {
    // blijft oppassen omdat je dan een LoadSheets forceert die lege sheets verwijdert
    browser.get('http://localhost:8100/');
    // isolate the tests by creating a new sheet for each test
    var activeSheetTab = new pageobjects.ActiveSheetTab();
    activeSheetTab.gotoTab();
    activeSheetTab.getNewSheetBtnClick();
  });


  it('test new sheet', function() {
    var activeSheetTab = new pageobjects.ActiveSheetTab();
    activeSheetTab.gotoTab();
    expect(activeSheetTab.getNumberOfCalcs()).toBe(0);

    var historyTab = new pageobjects.HistoryTab();
    historyTab.gotoTab();
    expect(historyTab.getFirstSheetName()).toBe('Untitled Sheet (active)');
    expect(historyTab.getFirstSheetNumberOfCalcs()).toBe(0);
  });


  it('test demo scenario', function() {
    var calculatorTab = new pageobjects.CalculatorTab();

    // voer 2.4 in
    calculatorTab.clickBtn2();
    calculatorTab.clickBtnDecimalSeparator();
    calculatorTab.clickBtn4();
    calculatorTab.clickBtnEquals();
    calculatorTab.clickPin();
    var nameDialog = new pageobjects.RenameDialog();
    nameDialog.giveName('interest rate');

    // voer 350.000 in
    calculatorTab.clickBtn3();
    calculatorTab.clickBtn5();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtnEquals();
    calculatorTab.clickPin();
    var nameDialog = new pageobjects.RenameDialog();
    nameDialog.giveName('amount');

    calculatorTab.clickBtnFunction();
    var selectFunctionDialog = new pageobjects.SelectFunctionDialog();
    selectFunctionDialog.selectPercentage();

    calculatorTab.recall('interest rate');
    calculatorTab.clickBtnEquals();
    expect(calculatorTab.getDisplay()).toEqual('8,400');
    calculatorTab.clickPin();
    var nameDialog = new pageobjects.RenameDialog();
    nameDialog.giveName('interest');

    var activeSheetTab = new pageobjects.ActiveSheetTab();
    activeSheetTab.gotoTab();
    expect(activeSheetTab.getFirstCalc()).toBe('interest');
    //browser.pause();
    expect(activeSheetTab.getNumberOfRows()).toBe(3);
    expect(activeSheetTab.getNumberOfCalcs()).toBe(5);

    var historyTab = new pageobjects.HistoryTab();
    historyTab.gotoTab();
    expect(historyTab.getFirstSheetName()).toBe('Untitled Sheet (active)');
    expect(historyTab.getFirstSheetFirstCalcName()).toBe('interest');
    expect(historyTab.getFirstSheetNumberOfCalcs()).toBe(3);

  });



  it('test plus/min operator', function() {
    var calculatorTab = new pageobjects.CalculatorTab();
    calculatorTab.clickBtnClear();
    calculatorTab.clickBtn2();
    calculatorTab.clickBtn0();
    calculatorTab.clickBtnEquals();

    calculatorTab.clickPin();
    var nameDialog = new pageobjects.RenameDialog();
    nameDialog.giveName('twintig');

    calculatorTab.clickBtn1();
    calculatorTab.clickBtnPlus();
    calculatorTab.clickBtnPlusMin();
    calculatorTab.recall('twintig');
    calculatorTab.clickBtnEquals();
    expect(calculatorTab.getDisplay()).toEqual('-19');
  });


  it('very simple calculation  1 + 2 = 3', function() {
    var calculatorTab = new pageobjects.CalculatorTab();
    calculatorTab.gotoTab();
    expect(calculatorTab.getDisplay()).toEqual('0');

    calculatorTab.clickBtn1();
    expect(calculatorTab.getDisplay()).toEqual('1');

    calculatorTab.clickBtnPlus();
    calculatorTab.clickBtn2();
    calculatorTab.clickBtnEquals();

    expect(calculatorTab.getDisplay()).toEqual('3');
    expect(calculatorTab.getExpression()).toEqual('1+2 = 3');
  });


  it('simple calculation with separators  100,000 + 2.1 = 100,002.1', function() {
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


  it('test rename of calculation', function() {
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
    expect(activeSheetTab.getNumberOfCalcs()).toBe(1);

    var historyTab = new pageobjects.HistoryTab();
    historyTab.gotoTab();
    expect(historyTab.getFirstSheetName()).toBe('Untitled Sheet (active)');
    expect(historyTab.getFirstSheetFirstCalcName()).toBe('testname');
    expect(historyTab.getFirstSheetNumberOfCalcs()).toBe(1);
  });




});
