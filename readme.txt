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

Ionic View
stephanwesten@gmail.com
wachtwoord: <straat><huisnr>a


Issues
-----

lijst van sheets update niet als je alle sheets verwijderd.

persisteren moet per sheet

limiet op aantal calculaties en aantal sheets (met name belangrijk als we gratis verspreiden)

lastVarName zou lastVarNumber moeten worden, veel simpeler

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

decimal separator wordt niet getoond

achtergrond kleur bij sheet list loopt niet door

beep of vibrate bij fout in calculator

test schrijven voor filter bij calculator

bij aanzetten of activeren kunnen of een bepaalde tijdsperiode is verstreken en zo ja een nieuwe sheet maken.

aan settings tab een 'send feedback' toevoegen

killer-feature: maak t mogelijk om 1 var als input aan te wijzen (evt meerdere tzt) en 1 var als result/output.
Voeg dan een run icon toe aan een sheet. Dit toont popup met de input var(s)


voor ipad en iphone verschillende font sizes gebruiken mbv media queries:
http://stackoverflow.com/questions/11777598/font-size-relative-to-the-users-screen-resolution

nice-to-have
------------
toon 'today' of 'yesterday' ipv de datum
misschien moeten we tzt een divider toevoegen zoals bij lists kan, kan je makkelijk vorige week zien.

plaats files mbt feature bij elkaar



Distribute
-----------
icon v/d app
minimize/ulgify js
controleer persistence rules Apple
screenshots maken (goede use-cases)
website nodig?