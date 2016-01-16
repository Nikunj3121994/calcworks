// instructions:
// 1) start webdriver:                           $ webdriver-manager start
// 2) run the protractor tests from /test/e2e:   $ protractor conf.js


'use strict';

var CalculatorTab = function() {
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
        var calcNames = element.all(by.css('.calcNameExpr'));
        return calcNames.get(0).getText();
    }

    this.getNumberOfCalcs = function() {
        var calcNames = element.all(by.css('.calcNameExpr'));
        return calcNames.count();
    };
};

var HistoryTab = function() {
    this.gotoTab = function()  {
        browser.get('http://localhost:8100/#/tab/sheets');
    };

    this.getFirstSheetName = function() {
        var sheets = element.all(by.repeater('sheet in sheets'));
        // expect(sheets.count()).toEqual(1); // tijdelijke test ter interne verificatie
        var sheetName = sheets.get(0).element(by.binding('sheet.name'));
        return sheetName.getText();
    }

    this.getFirstSheetFirstCalcName = function() {
        var sheets = element.all(by.repeater('sheet in sheets'));
        //expect(sheets.count()).toEqual(1); // tijdelijke test
        //var calculations = sheets.get(0).element.all(by.binding('calc.name'));
//        return calculations.get(0).getText();
        var calculations = sheets.get(0).element(by.binding('calc.name'));
        return calculations.getText();
    }

}

var RenameDialog = function() {
    // by model does not work
    var inputField =  element(By.xpath('//input[@ng-model="data.name"]'));  // mmm hoofdletter By  - typo?
    var okBtn = element(by.buttonText('OK'));

    this.giveName = function(name) {
        inputField.sendKeys(name);
        okBtn.click();
    }
};


module.exports.CalculatorTab = CalculatorTab;
module.exports.ActiveSheetTab = ActiveSheetTab;
module.exports.HistoryTab = HistoryTab;
module.exports.RenameDialog = RenameDialog;
