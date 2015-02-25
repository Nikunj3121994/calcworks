Installatie instructies
-----------------------

$ npm install -g cordova ionic

echter dan is gulp nog niet geinstalleerd:
$ npm install --global gulp
$ npm install --save-dev gulp

Ik kreeg toen een foutmelding over gulp-util die ontbrak. Opgelost door:
- de node-modules te verwijderen
- $ npm install


om Karma testen te draaien:
$ npm install --save-dev gulp-karma

angular-mocks was niet geinstalleerd met ionic. Toegevoegd:
$ bower install angular-mocks#1.3.6
Het gevolg is dat onder de lib folder ook andere libs zijn toegevoegd, zoals angular zelf en default libs...
In karma.conf.js gebruik ik op dit moment nog de ionic angular libs, weet niet wat t beste is.
Evt kunnen we de angular folders direct onder lib verwijderen - behalve de angular-mocks folder natuurlijk
Of we gebruiken vanuit karma de angular folders die onder lib hangen. Echter dit heeft het nadeel dat je potentieel
een andere angular versie gebruikt vanuit ionic...

npm install karma-jasmine --save-dev

npm install karma-chrome-launcher --save-dev


Karma vanaf de cmd line runnen (handig omdat dit meer info geeft dan via gulp)
vanuit de test folder:
$ karma start --single-run
$ karma start --auto-watch


Ionic op specifiek device runnen:
$ /Users/admin/projects/calcworks/platforms/ios/cordova/lib/list-emulator-images
$ cordova emulate ios --target="iPhone-5s"


Github
$ git push origin master

om intelliJ files niet meer te tracken:
$ git update-index --assume-unchanged .idea/workspace.xml


wachtwoord: <straat><huisnr>a


Issues
-----

lijst van sheets update niet als je alle sheets verwijderd.

new button moet in de header of zo, kan evt via een side-menu. New, help, contact,about e.d. http://ionicframework.com/docs/api/directive/ionSideMenus/
nadeel van side-menu is dat t meer een navigatie menu is ipv een actie menu. Misschien is actionSheet wel beter.

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

decimal separator wordt niet getoond

achtergrond kleur bij sheet list loopt niet door

beep of vibrate bij fout in calculator

test schrijven voor filter bij calculator

hoogte van de rows - moet dynamisch. Ik snap t alleen niet, t staat nu op 12% - dat is relatief...

het file heet sheetsService, maar de service heet sheetService (de 's')
plaats files mbt feature bij elkaar

reorder van de calcs

icon v/d app

bij aanzetten of activeren een nieuwe sheet starten

toon 'today' of 'yesterday' ipv de datum
misschien moeten we tzt een divider toevoegen zoals bij lists kan, kan je makkelijk vorige week zien.

aan settings tab een 'send feedback' toevoegen

alle sheets verwijderen kan ook de huidige (current) verwijderen, die blijft dan echter bestaan in de ctrl.
Zelfde als je de huidige sheet delete dan komt weer ie terug na calculatie toevoegen.
CalculatorCtrl zou in de gaten moeten hebben dat de huidige sheet verwijderd is en een nieuwe moeten aanmaken.
Opl:
 ik denk dat het mooiste is als de service bij een delete een deleteSheets event verstuurt met de id van
 de sheet die verwijderd is. null als meerdere sheets verwijderd zijn
 de calcCtrl zet dan bij zelfde id sheet = createNewSheet

 als je een nieuwe sheet aanmaakt, heeft ie nog geen id. Je kan dan niet zijn details editen...