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

Update van libraries
--------------------
$sudo npm update
(misschien moet de  -g  erachter, want bower ging niet mee)

$bower list
laat zien wat er bijgewerkt kan worden

updaten van ionic:
$ionic lib update
(ik moest hiertoe wel eerst de twee bower files uit /lib/ionic verwijderen)

daarna de rest bijwerken:
$bower update

Cordova bijwerken:
sudo npm update -g cordova

Updates the project to use the latest version of cordova:
$ cordova platform update ios

Je kan verifieren op welke versie van cordova je zit door:
$ npm list -g cordova

App bouwen
-----------
cordova prepare ios
ionic build ios

Testen runnen
-------------
Karma vanaf de cmd line runnen (handig omdat dit meer info geeft dan via gulp)
vanuit de test folder:
$ karma start --single-run
$ karma start --auto-watch

Ionic runnen
--------------
$ ionic serve
(gebruik 'c' om de logs te zien)

Ionic op specifiek device runnen:
$ /Users/admin/projects/calcworks/platforms/ios/cordova/lib/list-emulator-images
$ cordova emulate ios --target="iPhone-5s"


Github
$ git push origin master

om intelliJ files niet meer te tracken:
$ git update-index --assume-unchanged .idea/workspace.xml

Ionic View
$ ionic upload
stephanwesten@gmail.com
wachtwoord: <straat><huisnr>a

UI-Router
=========
UI-Router heeft deze eigenschap:
.. with ui-router, every time a query arg is changed, it is a state change, the controller is executed again, and the template is re-rendered.
(http://www.jeremyzerr.com/using-angularjs-ui-router-query-parameters-and-complex-directives-together-without-killing-app)
Dit is wat we niet willen voor de calculator-tab.


Distribute
-----------
icon v/d app
minimize/ulgify js
controleer persistence rules Apple
screenshots maken (goede use-cases)
website nodig?


Issues
-------
editen van een expressie in het calculator scherm. Voorstel is dat je de expressie items kan aanklikken en dan bewerken.
Je kan een recall of een getal invoeren.


samen nemen van de calc name invoer dialogen
alle operatoren en haakjes als variable naam mag niet, getal ook niet


persisteren moet per sheet, updated timestamp toevoegen

Launch image voor IOS

limiet op aantal calculaties en aantal sheets (met name belangrijk als we gratis verspreiden)

om autofocus voor elkaar te krijgen:
http://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/28
For it to work with cordova you need to add this in your config.xml
<preference name="KeyboardDisplayRequiresUserAction" value="false" />

lastVarName zou lastVarNumber moeten worden, veel simpeler

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

aantal decimalen instelbaar maken

share moet eruit of werken

beep of vibrate bij fout in calculator

bij aanzetten of activeren kunnen of een bepaalde tijdsperiode is verstreken en zo ja een nieuwe sheet maken.

aan settings tab een 'send feedback' toevoegen

killer-feature: maak t mogelijk om 1 var als input aan te wijzen (evt meerdere tzt) en 1 var als result/output.
Voeg dan een run icon toe aan een sheet. Dit toont popup met de input var(s)

voor ipad en iphone verschillende font sizes gebruiken mbv media queries:
http://stackoverflow.com/questions/11777598/font-size-relative-to-the-users-screen-resolution

nice-to-have
------------

bij een operator of haakje als calc name een foutmelding tonen

plaats files mbt feature bij elkaar

als je een lege sheet hebt en je doet new dan krijg je geen feedback

de items in een expression zouden objecten moet zijn van een class hierarchy. De parent class heeft toString methods

cijfers achter de komma instelbaar

de getallen moeten in display en expression een pixel hoger



PRO VERSIE
In app purchase zodat je later de limiet van max 10 sheets kan overschrijven
aantal decimalen instelbaar
Aantal sheets limiet ophogen tot 50 of zo, evt archive functie toevoegen
Twee sheets naast elkaar waarbij je waarden of items van de ene naar de andere kan slepen. Op deze manier kan je makkelijk, een nieuwe, schone sheet maken. Die je dan kan delen.
Kopieer sheet
Sharen via email (pdf / excel) of sms. Contact selecteren uit adresboek.
Meer meta data bij een sheet:
Locatie bij aanmaken v e sheet opslaan
Omschrijving bij een sheet opslaan
Clipboard functionaliteit zodat je de waarde kan kopieren of pasten in de calculator

PRO II VERSIE
Koers opvragen web service
Meta data per item, bijvoorbeeld een datum, periode, tekst len/of waarde


OVERWEGING
Je zou (soms) willen dat ie bij elke nieuwe waarde om n var naam vraagt. Met t pinnetje kan je dit aan of uitzetten. Voor tussenliggende waarden moet je de vraag makkelijk kunnen overslaan.
Je zou ipv een pinnetje een M kunnen tonen. Twee keer op M pint m vast.  Analoog shift toets ipad.

Alternatief kleuren schema: wit , grijs en oranje

USE CASES
uitgaven bijhouden op vakantie
Offerte maken
Koers conversie
Historische gegevens bijhouden, bijv #km gefietst of gelopen. Dan wil je per dag 2 waarden invoeren; tijd en aantal. Door (meta) data mogelijk te maken per item kan je n spreadsheet simuleren. Bij de sheet geef je je extra vars op. Die kan je dan per item invullen. Bij n export krijg je een spreadsheet.