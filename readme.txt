Installatie instructies
-----------------------

$ npm install -g cordova ionic

echter dan is gulp nog niet geinstalleerd:
$ npm install --global gulp
$ npm install --save-dev gulp

Ik kreeg toen een foutmelding over gulp-util die ontbrak. Opgelost door:
- de node-modules te verwijderen
- $ npm install

Minify plugin toevoegen
$ npm install ionic-minify --save-dev
en schrijfrechten voor de hooks folder
$ chmod -R 755 ./hooks

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
$ sudo npm update -g

$ bower list
laat zien wat er bijgewerkt kan worden aan bower dependencies. Cordova zit op npm nivo - die gaat dus niet mee.

Updaten van ionic
-----------------
$ ionic lib update

Dit werkt helaas niet goed. Met bower list kan je achterhalen wat de laatste versie is. Vervolgens pas je dit met de
hand aan in bower.json, de regel met  "ionic": "driftyco/ionic-bower#x.y.z"
note: ionic-bower is de bower repository voor ionic

Ik moest Angular met de hand bijwerken in het bower.json file en met de hand angular animate en mocks upgraden
Op een of andere manier staat ergens in de code base de versie van de laatste twee (indirect) gespecificeerd. t Lijkt
te komen doordat mock library met de hand is geinstalleerd.

note: ionic.bundle.js heeft angularjs met zich mee gebundeld
note: ionic specificeert in zijn bower.json welke angularjs versie t nodig heeft

daarna de rest bijwerken:
$bower update


Cordova bijwerken
-----------------
Je kan verifieren op welke versie van cordova je zit door:
$ npm list -g cordova

Bijwerken:
$ sudo npm update -g cordova

Updates the project to use the latest ios version of cordova:
$ cordova platform update ios

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
vanuit de *test* folder:
$ karma start --single-run

Of via de termimal de testen continue runnen:
$ karma start karma.conf.js --auto-watch

Mbv IntelliJ kan ook, karma plugin installeren en via rechtermuistoets runnen als je op karma file staat



Ionic runnen
--------------
$ ionic serve
(gebruik 'c' om de logs te zien)

Opvragen welke devices er zijn (shell script):
$ platforms/ios/cordova/lib/list-emulator-images

Ionic op specifiek device runnen:
$ ionic emulate ios --target="iPhone-5s"


$ ionic emulate --livereload ios

De emulate gaat fout omdat cordova een security feature heeft toegevoegd die netwerk access blokt, je moet dan doen:
$ ionic plugin add https://github.com/apache/cordova-plugin-whitelist.git

Echter de cordova-ios versie zit op 3.9 ipv 4. We moeten dus nog even wachten totdat die er is.
Of de vorige versie van de whitelist plugin installeren.


Debuggen
--------
De makkelijkste manier is via ionic -serve de console aan te zetten.
Chrome kan behoorlijk goed via dev tools de iphone simuleren - visueel.
Vervolgens kan je de iphone simulator gebruiken:  ionic emulate ios --target="iPhone-5s"
In het uiterste geval kan je via Safari dev tools
de console te zien krijgen van de iphone door de iPhone via een kabel aan de mac te hangen en in Safari's
menu te kiezen:  Develop | iPhone van Stephan en dan (calcworks) index.html


Github
------
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
In config.xml (van Cordova) specifeer je het icon en launch (splash) image.
Op dit moment heb ik maar 1 generiek file voor t icon en een voor launch image.
De launch image heb ik gemaakt door een screenshot te maken in de emulator voor de iphone 6 plus.
Die heb ik daarna bewerkt met Seashore en horizontaal gescaled naar 2208 x 2208.
Daarna met ionic resources --splash de images gegenereert.
Alleen twee landscape ipad images zien er niet goed uit, hierbij verdwijnt de witte header en de footer.
(ik dacht dat doordat de Orientation op "portrait" staat er geen landscape images worden gegenereerd - maar dat is nu onduidelijk)

Via bijvoorbeeld http://makeappicon.com/ kunnen we evt ook specifieke iconen genereren.

Text. The launch image is static, so any text you display in it won’t be localized.
Static launch images for all devices must include the status bar region.
The source image’s minimum dimensions should be 2208 x 2208 px



Instructies maken van een release voor deploy naar appstore
===========================================================

versie nummer ophogen in config.xml

$ ionic build --release    (ivm uglify)


XCode opties bij een Distributie maken
---------------------------------------
- menu Product | build for running
- validate build product aanvinken voor 1 keer (?)
- Info | iOS Deployment Target - kunnen we evt op 9.1 zetten - dit ivm glytch bij rendering
- Build | Build Options - op release
- Bij Devices heb ik alleen iphone geselecteerd  (dit zit bij General info tab in Xcode)

calculatorgems@gmail.com / calc1404

https://developer.apple.com/membercenter/index.action


TODO voor Distribute:
hoe zit t met  cordova-plugin-console, moet die voor de release eruit?
controleer persistence rules Apple
screenshots maken (goede use-cases)




Issues
============


Bugs
-------

Improvements
--------------

paste functionaliteit

laden van de sheets in de achtergrond als je een nieuwe start

run vanuit history.
Misschien dat je de updated tijd moet aanpassen of vragen of ie favorite moet worden zodat de macro niet per ongeluk
verwijderd wordt

navigeren naar vorige sheet vanuit header bar  <-  en  ->   of  als je erop klikt dan een keuze maken

de notifications kunnen mooier. In het scherm sliden, time-out voor sluiten en ook met x kunnen closen

de edit/rename popup zit te laag
gebruik $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
                scope: null,
                animation: 'slide-in-up'

als je een expressie hebt zoals prijs x rente dan moet je die makkelijk uit elkaar kunnen trekken

opnieuw de config.xml aanmaken aan de hand van de laatste cordova versie (ook dit checken)
xcode geeft een warning over een deprecated iets:
/Users/admin/projects/calcworks/platforms/ios/Calcworks/Plugins/org.apache.cordova.device/CDVDevice.m:64:33: 'uniqueAppInstanceIdentifier' is deprecated: Deprecated in Cordova 3.8 .0. API is slated for removal in 4.0.0

markeer een sheet als favorite en hij blijft staan ipv naar boven te gaan

mailen - je wilt een simpelere lay-out, zoiets als   rente kosten = 300,000 x 3.2% = 1040  oid

de error log van de calc service wordt niets mee gedaan. Tonen in settings dlg?

rename sheet vanuit calculator tab (evt)

om autofocus voor elkaar te krijgen:
http://forum.ionicframework.com/t/auto-focus-textbox-while-template-loads/6851/28
For it to work with cordova you need to add this in your config.xml
<preference name="KeyboardDisplayRequiresUserAction" value="false" />

lastVarName zou lastVarNumber moeten worden, veel simpeler

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

beep of vibrate bij fout in calculator

merk op dat als je alle sheets blijft bewerken binnen 30 dagen er niets verwijderd wordt

plaats files mbt feature bij elkaar

Misschien dat we bij groter dan miljoen in Ks moeten afbeelden?
het font van de expression kan kleiner worden als de inhoud groeit
het aantal decimalen instelbaar


nice-to-have
------------

verzin een api voor extensies zodat wiskundige problemen opgelost kunnen worden.

maak t mogelijk om een range van invoerwaarden aan te geven voor de macro en toon de antwoorden in een tabel
evt met grafiek

het type van de invoer kunnen bepalen (euro, tijdsduur, etc)

toon een piechart en maak het mogelijk om rows wel of niet mee te doen

later wil je functies kunnen invoeren. Een van deze functies zou een select(calcname1, calcname2, ...) kunnen zijn.
Deze is handig voor de killer-feature om de gebruiker een selectie te laten maken.

Om code compacter te maken:
angular.module("myApp").run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

moeten we een lastSeen / lastUsed field toevoegen zodat je daar ook op kan sorteren.
Misschien ook handig ivm macro runnen

In de history a la Google Docs per 'today' en 'deze week' en 'deze maand' laten zien

samen nemen van btns Delete en Reorder into Change. Bij actief maken dan de ... button kolom hidden

voor het emailen en de title is nog untitled dan de rename dlg tonen

misschien moeten we tzt een divider toevoegen zoals bij lists kan, kan je makkelijk vorige week zien.

voor ipad en iphone verschillende font sizes gebruiken mbv media queries:
http://stackoverflow.com/questions/11777598/font-size-relative-to-the-users-screen-resolution

de namen v.e. calc hoeven niet uniek te zijn, misschien een warning tonen. Kan bij export excel of zo een probleem worden


PRO VERSIE
In app purchase zodat je later de limiet van max favorites kan overschrijven
aantal decimalen instelbaar
Aantal sheets limiet ophogen tot 50 of zo, evt archive functie toevoegen
Twee sheets naast elkaar waarbij je waarden of items van de ene naar de andere kan slepen. Op deze manier kan je makkelijk, een nieuwe, schone sheet maken. Die je dan kan delen.
Kopieer sheet
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