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
new button moet in de header of zo, kan evt via een side-menu. New, help, contact,about e.d. http://ionicframework.com/docs/api/directive/ionSideMenus/
nadeel van side-menu is dat t meer een navigatie menu is ipv een actie menu. Misschien is actionSheet wel beter.

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

decimal separator wordt niet getoond

voor de sheet details kan je heel goed de list gebruiken, http://ionicframework.com/docs/api/directive/ionList/

achtergrond kleur bij sheet list loopt niet door

beep of vibrate bij fout in calculator

test schrijven voor filter bij calculator

hoogte van de rows - moet dynamisch. Ik snap t alleen niet, t staat nu op 12% - dat is relatief...

het file heet sheetsService, maar de service heet sheetService (de 's')

de volgorde van de sheets, op createdDate?

aanpassen van de naam van de sheet - hoe?

rechts align van de results, maar liefst zodat de dec sep wel op een vaste plek zit

settings dialog moet nog op de schop, bij deleten van alle sheets, moet er nog een broadcast

na het deleten van een calculatie moet je nog persisten

icon

bij aanzetten of activeren een nieuwe sheet starten

favorite support.

toon 'today' of 'yesterday' ipv de datum
misschien moeten we tzt een divider toevoegen zoals bij lists kan, kan je makkelijk vorige week zien.