// instructions:
// 1) start webdriver:                           $ webdriver-manager start
// 2) run the protractor tests from /test/e2e:   $ protractor conf.js


'use strict';


//var BrowserConsole = function() {
//    this.dump() {
//      browser.manage().logs().get('browser').then(function(browserLog) {
//        console.log('log: ' + require('util').inspect(browserLog));
//    });
//  }
//}

var CalculatorTab = function() {
    var display = element(by.css('.display-input-text'));
    var expression = element(by.tagName('resolve-expression'))
    var btn0 = element(by.buttonText('0'));
    var btn1 = element(by.buttonText('1'));
    var btn2 = element(by.buttonText('2'));
    var btnPlus =  element(by.buttonText('+'));
    var btnPlusMin =  element(by.buttonText('±'));
    var btnEquals = element(by.buttonText('='));
    var btnClear = element(by.buttonText('Clear'));
    var btnRecall = element(by.buttonText('Recall'));
    var btnDecimalSeparator = element(by.buttonText('.'));
    var btnPin = element(by.css('.ion-pin'));

    this.gotoTab = function() {
        // do not use browser.get because this triggers a reload and thus a loadSheets()
        browser.setLocation('tab/calculator');
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

    this.clickBtnPlusMin = function() {
        btnPlusMin.click();
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

    this.recall = function(calcName) {
        btnRecall.click();
        element.all(by.css('.listVarName')).each(function(elem, index) {
            elem.getText().then(function(name) {
                //console.log(name);
                if (name.trim() === calcName) {
                    elem.click();
                    return;
                }
            });
        });
        // unfortunately we cannot easily detect if calcName is not found
    }

};

var ActiveSheetTab = function() {
    this.gotoTab = function()  {
        browser.setLocation('tab/activesheet');
    };

    this.getFirstCalc = function() {
        var calcNames = element.all(by.css('.calcNameExpr'));
        return calcNames.get(0).getText();
    }

    this.getNumberOfCalcs = function() {
        var calcNames = element.all(by.css('.calcNameExpr'));
        return calcNames.count();
    };

    this.getNewSheetBtnClick = function() {
        // pak de laatste (onderste) menu btn
        var menuBtns = element.all(by.css('.ion-ios-more'));
        var s = menuBtns.count();
        s.then(function(count){
            var menuBtn = menuBtns.get(count-1);
            menuBtn.click();
            // soms is de New btn niet clickable, deze regel toevoegen verhielp t
            browser.driver.sleep(1000);
            browser.waitForAngular();
            var newBtn = element(by.buttonText('New'));
            newBtn.click();
        });
    };

};

var HistoryTab = function() {
    this.gotoTab = function()  {
        browser.setLocation('tab/sheets');
    };

    this.getFirstSheetName = function() {
        var sheets = element.all(by.repeater('sheet in sheets'));
        var sheetName = sheets.get(0).element(by.binding('sheet.name'));
        return sheetName.getText();
    }

    this.getFirstSheetFirstCalcName = function() {
        var sheets = element.all(by.repeater('sheet in sheets'));
        var firstSheet = sheets.get(0);
        var calculations = firstSheet.all(by.binding('calc.name'));
        return calculations.get(0).getText();
    }

    this.getFirstSheetNumberOfCalcs = function() {
        var sheets = element.all(by.repeater('sheet in sheets'));
        var firstSheet = sheets.get(0);
        var calculations = firstSheet.all(by.binding('calc.name'));
        return calculations.count();
    }

}

// assumes an already open rename dialog, can be used for calculations and sheets
var RenameDialog = function() {
    // by model does not work
    var inputField =  element(By.xpath('//input[@ng-model="data.name"]'));
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
