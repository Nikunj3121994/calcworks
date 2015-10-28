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

Lokaal karma installeren:
$npm install karma-jasmine --save-dev
(die save-dev zorgt ervoor dat karma als een developer dependency wordt behandeld

$npm install karma-jasmine karma-chrome-launcher --save-dev
(was npm install karma-chrome-launcher --save-dev)

en globaal de cli:
$ sudo  npm install -g karma-cli

Update van libraries
=============================
$sudo npm update -g

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
$ sudo npm update -g cordova

(hierrdoor bleef ik alleen op een oude versie zitten, toen gedaan: $sudo npm rm -g cordova   en  $sudo npm install -g cordova

Updates the project to use the latest version of cordova:
$ cordova platform update ios

Je kan verifieren op welke versie van cordova je zit door:
$ npm list -g cordova

Maar merk op dat plugins van cordova via het volgende commando moet:
$ cordova plugin ls
Dit vind je (wel) terug in package.json. Ze hebben daar een extensie gemaakt voor cordova plugins


Cordova bouwen
---------------
$ cordova platform add ios
$ ionic build ios
$ ionic emulate ios --device

App bouwen ter voorbereiding van XCode deploy
---------------------------------------------
$ cd projects/calcworks/
$ cordova prepare ios  (alleen de eerste keer)
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

Of via de termimal de testen continue runnen:
$ karma start karma.conf.js --auto-watch

Ionic runnen
--------------
$ ionic serve
(gebruik 'c' om de logs te zien)

Ionic op specifiek device runnen:
$ /Users/admin/projects/calcworks/platforms/ios/cordova/lib/list-emulator-images
$ cordova emulate ios --target="iPhone-5s"


$ ionic emulate --livereload ios

De emulate gaat fout omdat cordova een security feature heeft toegevoegd die netwerk access blokt, je moet dan doen:
$ ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git

Echter de cordova-ios versie zit op 3.9 ipv 4. We moeten dus nog even wachten totdat die er is.
Of de vorige versie van de whitelist plugin installeren.



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


bij het editen kan je recall doen en de expressie kiezen die je aan het editen bent

run vanuit history

navigeren naar vorige sheet vanuit header bar  <-  en  ->   of  als je erop klikt dan een keuze maken

de edit/rename popup zit te laag

als je een expressie hebt zoals prijs x rente dan moet je die makkelijk uit elkaar kunnen trekken

opnieuw de config.xml aanmaken aan de hand van de laatste cordova versie (ook dit checken)
xcode geeft een warning over een deprecated iets:
/Users/admin/projects/calcworks/platforms/ios/Calcworks/Plugins/org.apache.cordova.device/CDVDevice.m:64:33: 'uniqueAppInstanceIdentifier' is deprecated: Deprecated in Cordova 3.8 .0. API is slated for removal in 4.0.0

mailen - je wilt een simpelere lay-out, zoiets als   rente kosten = 300,000 x 3.2% = 1040  oid

de error log van de calc service wordt niets mee gedaan. Tonen in settings dlg?

limiet op aantal calculaties en aantal sheets en aantal favorite sheets (met name belangrijk als we gratis verspreiden)
Door de limiet op favorite sheets kan je altijd een niet-favorite sheet verwijderen bij t aanmaken van een nieuwe.
Bij het opstarten kijken we of de laatste sheet ouder dan een dag is.
zo niet, dan gaan we meteen door.
zo wel, dan verwijderen we de laatste sheet als updated=created

maken we een nieuwe sheet - mits de vorige niet leeg is. Als het totaal aantal sheets 50 is dan verwijderen we de laatste.

rename sheet vanuit calculator tab (evt)

om autofocus voor elkaar te krijgen:
http://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/28
For it to work with cordova you need to add this in your config.xml
<preference name="KeyboardDisplayRequiresUserAction" value="false" />

lastVarName zou lastVarNumber moeten worden, veel simpeler

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

beep of vibrate bij fout in calculator

bij settings tab, 'send feedback' juiste email adres invullen

Deploy appstore - gerelateerd
- het icon kan beter; visueel en 1024 x 1024
- minify
- tijd en carrier uit screenshot halen, nieuw screenshot nodig

we moeten iets anders verzinnen dan calcworks...
calcultra
calcgem
calcgems
calcberyl
swiss army knife
.info website eerste jaar paar euro, daarna uitkijken


nice-to-have
------------

het type van de invoer kunnen bepalen (euro, tijdsduur, etc)

toon een piechart en maak het mogelijk om rows wel of niet mee te doen

later wil je functies kunnen invoeren. Een van deze functies zou een select(calcname1, calcname2, ...) kunnen zijn.
Deze is handig voor de killer-feature om de gebruiker een selectie te laten maken.

Om code compacter te maken:
angular.module("myApp").run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

moeten we een lastSeen field toevoegen zodat je daar ook op kan sorteren

In de history a la Google Docs per 'today' en 'deze week' en 'deze maand' laten zien

samen nemen van btns Delete en Reorder into Change. Bij actief maken dan de ... button kolom hidden

voor het emailen en de title is nog untitled dan de rename dlg tonen

misschien moeten we tzt een divider toevoegen zoals bij lists kan, kan je makkelijk vorige week zien.

plaats files mbt feature bij elkaar

het aantal decimalen instelbaar

voor ipad en iphone verschillende font sizes gebruiken mbv media queries:
http://stackoverflow.com/questions/11777598/font-size-relative-to-the-users-screen-resolution




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