Installatie instructies
-----------------------

$ npm install -g cordova ionic

echter dan is gulp nog niet geinstalleerd:
$ npm install --global gulp
$ npm install --save-dev gulp

Ik kreeg toen een foutmelding over gulp-util die ontbrak. Opgelost door:
- de node-modules te verwijderen
- $ npm install

De email plugin toevoegen
-------------------------
Overgenomen van: https://github.com/katzer/cordova-plugin-email-composer
$ cordova plugin add de.appplant.cordova.plugin.email-composer@0.8.2
dan de libraries toevoegen voor ios platform via
$ ionic build ios


om Karma testen te draaien:
$ npm install --save-dev gulp-karma
(een deel van het Chrome window moet zichtbaar zijn anders gaat er minder CPU kracht naar toe)

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

Updaten van ionic
-----------------
$ionic lib update
Ik moest Angular met de hand bijwerken in het bower.json file en met de hand angular animate en mocks upgraden
Op een of andere manier staat ergens in de code base de versie van de laatste twee (indirect) gespecificeerd. t Lijkt
te komen doordat mock library met de hand is geinstalleerd.

daarna de rest bijwerken:
$bower update

Cordova bijwerken:
sudo npm update -g cordova

Updates the project to use the latest version of cordova:
$ cordova platform update ios

Je kan verifieren op welke versie van cordova je zit door:
$ npm list -g cordova

Cordova bouwen
---------------
$ cordova platform add ios
$ ionic build ios
$ ionic emulate ios

App bouwen ter voorbereiding van XCode deploy
---------------------------------------------
$ cd projects/calcworks/
$ cordova prepare ios  (alleen de eerste keer vermoed ik)
$ ionic build ios

XCode
=====
Laadt het project 'calcworks.xcodeproj' in de platforms/ios folder
Je kan runnen op de iphone door linksboven 'iphone stephan' te kiezen (ipv de emulators)

Testen runnen
-------------
Karma vanaf de cmd line runnen (handig omdat dit meer info geeft dan via gulp)
vanuit de test folder:
$ karma start --single-run
$ karma start --auto-watch
Mbv IntelliJ kan ook, karma plugin installeren en via rechtermuistoets runnen als je op karma file staat

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
Ionic cached views om re-render te beperken.

Launch image en icon
--------------------
In config.xml (van Cordova) specifeer je het icon en launch (splash) image. Op dit moment heb ik maar 1 generiek
file voor t icon en een voor launch image. De launch image heb ik gemaakt door een screenshot te maken in de emulator.
Daarna met een service de verschillende formaten gegenereert.
Cordova copieert / genereert de device specifieke schermen. Zie de folder
/.../calcworks/platforms/ios/Calcworks/Resources
Via bijvoorbeeld http://makeappicon.com/ kunnen we evt ook specifieke iconen genereren.
Ik weet niet of dat ook voor het launch image kan - en of t loont.


Distribute
-----------
icon v/d app + launch image
minimize/uglify js
controleer persistence rules Apple
screenshots maken (goede use-cases)
website nodig?


Issues
-------


we moeten iets anders verzinnen dan calcworks...
calcultra
calcgem
calcgems
calcberyl
.info website eerste jaar paar euro, daarna uitkijken

opnieuw de config.xml aanmaken aan de hand van de laatste cordova versie (ook dit checken)
xcode geeft een warning over een deprecated iets:
/Users/admin/projects/calcworks/platforms/ios/Calcworks/Plugins/org.apache.cordova.device/CDVDevice.m:64:33: 'uniqueAppInstanceIdentifier' is deprecated: Deprecated in Cordova 3.8 .0. API is slated for removal in 4.0.0

editen van een expressie in het calculator scherm. Voorstel is dat je de expressie items kan aanklikken en dan bewerken.
Je kan een recall of een getal invoeren.

later wil je functies kunnen invoeren. Een van deze functies zou een select(calcname1, calcname2, ...) kunnen zijn.
Deze is handig voor de killer-feature om de gebruiker een selectie te laten maken.

de error log van de calc service wordt niets mee gedaan

limiet op aantal calculaties en aantal sheets en aantal favorite sheets (met name belangrijk als we gratis verspreiden)
Door de limiet op favorite sheets kan je altijd een niet-favorite sheet verwijderen bij t aanmaken van een nieuwe.
Bij het opstarten kijken we of de laatste sheet ouder dan een dag is.
zo niet, dan gaan we meteen door.
zo wel, dan verwijderen we de laatste sheet als updated=created

maken we een nieuwe sheet - mits de vorige niet leeg is. Als het totaal aantal sheets 50 is dan verwijderen we de laatste.

om autofocus voor elkaar te krijgen:
http://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/28
For it to work with cordova you need to add this in your config.xml
<preference name="KeyboardDisplayRequiresUserAction" value="false" />

het icon kan beter; visueel en 1024 x 1024

lastVarName zou lastVarNumber moeten worden, veel simpeler

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

beep of vibrate bij fout in calculator

bij aanzetten of activeren kunnen of een bepaalde tijdsperiode is verstreken en zo ja een nieuwe sheet maken.

aan settings tab een 'send feedback' toevoegen

killer-feature: maak t mogelijk om 1 var als input aan te wijzen (evt meerdere tzt) en 1 var als result/output.
Voeg dan een run icon toe aan een sheet. Dit toont popup met de input var(s)

voor ipad en iphone verschillende font sizes gebruiken mbv media queries:
http://stackoverflow.com/questions/11777598/font-size-relative-to-the-users-screen-resolution

nice-to-have
------------

samen nemen van btns Delete en Reorder into Change. Bij actief maken dan de ... button kolom hidden

voor het emailen en de title is nog untitled dan de rename dlg tonen

misschien moeten we tzt een divider toevoegen zoals bij lists kan, kan je makkelijk vorige week zien.

plaats files mbt feature bij elkaar

als je een lege sheet hebt en je doet new dan krijg je geen feedback

het aantal decimalen instelbaar

de getallen moeten in display en expression een pixel hoger




PRO VERSIE
In app purchase zodat je later de limiet van max 10 sheets en max favorites kan overschrijven
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