// instructions:
// 1) start webdriver:                           $ webdriver-manager start
// 2) run the protractor tests from /test/e2e:   $ protractor conf.js


'use strict';

describe('calculator', function() {

    var TabCalculator = function() {
        var display = element(by.css('.display-input-text'));
        var expression = element(by.tagName('resolve-expression'))
        var btn0 = element(by.buttonText('0'));
        var btn1 = element(by.buttonText('1'));
        var btn2 = element(by.buttonText('2'));
        var btnPlus =  element(by.buttonText('+'));
        var btnEquals = element(by.buttonText('='));
        var btnClear = element(by.buttonText('Clear'));
        var btnDecimalSeparator = element(by.buttonText('.'));
        var btnPin = element(by.css('.ion-pin'));

        this.gotoTab = function() {
            browser.get('http://localhost:8100/#/tab/calculator');
        };

        this.getDisplay = function() {
            return display.getText();
        };

        this.getExpression = function() {
            return expression.getText();
        };

        this.clickBtn0 = function() {
            btn0.click();
        }

        this.clickBtn1 = function() {
            btn1.click();
        }

        this.clickBtn2 = function() {
            btn2.click();
        }

        this.clickBtnPlus = function() {
            btnPlus.click();
        }

        this.clickBtnEquals = function() {
            btnEquals.click();
        }

        this.clickBtnClear = function() {
            btnClear.click();
        }

        this.clickBtnDecimalSeparator = function() {
            btnDecimalSeparator.click();
        }

        this.clickPin = function() {
            btnPin.click();
        }
    };

  var ActiveSheetTab = function() {
    this.gotoTab = function()  {
        browser.get('http://localhost:8100/#/tab/activesheet');
    };

    this.getFirstCalc = function() {
        var items = element.all(by.css('.calcNameExpr'));
        return items.get(0).getText();
    }

//    this.getNumberOfCalcs = function()  {
//        var items = element.all(by.css('.calcNameExpr'));
//        items.then(function(items) {
//          return items.length;
//        });
//    };
  };

  var NameDialog = function() {
    // by model does not work
    var inputField =  element(By.xpath('//input[@ng-model="data.name"]'));  // mmm hoofdletter By  - typo?
    var okBtn = element(by.buttonText('OK'));

    this.giveName = function(name) {
        inputField.sendKeys(name);
        okBtn.click();
    }
  };


  beforeEach(function() {
    browser.get('http://localhost:8100/');
  });


  it('very simple calculation  1 + 2 = 3', function() {
    var tabCalculator = new TabCalculator();
    expect(tabCalculator.getDisplay()).toEqual('0');

    tabCalculator.clickBtn1();
    expect(tabCalculator.getDisplay()).toEqual('1');

    tabCalculator.clickBtnPlus();
    tabCalculator.clickBtn2();
    tabCalculator.clickBtnEquals();

    expect(tabCalculator.getDisplay()).toEqual('3');
    expect(tabCalculator.getExpression()).toEqual('1+2 = 3');
  });


  it('simple calculation with separators  100,000 + 2,1 = 100,002.1', function() {
    var tabCalculator = new TabCalculator();
    tabCalculator.clickBtnClear();
    expect(tabCalculator.getDisplay()).toEqual('0');

    tabCalculator.clickBtn1();
    tabCalculator.clickBtn0();
    tabCalculator.clickBtn0();
    tabCalculator.clickBtn0();
    tabCalculator.clickBtn0();
    tabCalculator.clickBtn0();
    expect(tabCalculator.getDisplay()).toEqual('100,000');

    tabCalculator.clickBtnPlus();
    tabCalculator.clickBtn2();
    tabCalculator.clickBtnDecimalSeparator();
    tabCalculator.clickBtn1();
    tabCalculator.clickBtnEquals();

    expect(tabCalculator.getDisplay()).toEqual('100,002.1');
  });


  it('simple calculation with name', function() {
    var tabCalculator = new TabCalculator();
    tabCalculator.clickBtnClear();
    expect(tabCalculator.getDisplay()).toEqual('0');

    tabCalculator.clickBtn1();
    tabCalculator.clickBtnPlus();
    tabCalculator.clickBtn2();
    tabCalculator.clickBtnEquals();
    expect(tabCalculator.getDisplay()).toEqual('3');

    tabCalculator.clickPin();

    var nameDialog = new NameDialog();
    nameDialog.giveName('testname');

    var activeSheetTab = new ActiveSheetTab();
    activeSheetTab.gotoTab();
    expect(activeSheetTab.getFirstCalc()).toBe('testname');
    //expect(activeSheetTab.getNumberOfCalcs()).toBe(3);
  });




});
