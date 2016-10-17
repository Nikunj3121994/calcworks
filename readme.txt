Installatie instructies
-----------------------
$ sudo npm install -g bower

$ sudo npm install -g cordova ionic
$ sudo npm -g install ios-sim.

echter dan is gulp nog niet geinstalleerd:
(gulp wil ik eruit krijgen, dit overslaan)
$ npm install --global gulp
$ npm install --save-dev gulp

Ik kreeg toen een foutmelding over gulp-util die ontbrak. Opgelost door:
- de node-modules te verwijderen
- $ npm install

Minify plugin toevoegen
$ npm install ionic-minify --save-dev
en schrijfrechten voor de hooks folder
$ chmod -R 755 ./hooks
(let op: het cordova ios platform heeft ook een hook. Ik heb hierna ios platform verwijderd en weer toegevoegd)

De email plugin toevoegen
-------------------------
Overgenomen van: https://github.com/katzer/cordova-plugin-email-composer
$ cordova plugin add cordova-plugin-email-composer@0.8.3
dan de libraries toevoegen voor ios platform via
$ ionic build ios



Karma testen installeren
------------------------
$ npm install --save-dev gulp-karma
(een deel van het Chrome window moet zichtbaar zijn anders gaat er minder CPU kracht naar toe)
(Deze sla ik nu over omdat ik zonder gulp wil werken)

angular-mocks was niet geinstalleerd met ionic. Toegevoegd:
$ bower install angular-mocks#1.3.6
Het gevolg is dat onder de lib folder ook andere libs zijn toegevoegd, zoals angular zelf en default libs...
In karma.conf.js gebruik ik op dit moment nog de ionic angular libs, weet niet wat t beste is.
Evt kunnen we de angular folders direct onder lib verwijderen - behalve de angular-mocks folder natuurlijk
Of we gebruiken vanuit karma de angular folders die onder lib hangen. Echter dit heeft het nadeel dat je potentieel
een andere angular versie gebruikt vanuit ionic...

Lokaal jasmine en karma installeren:
$ npm install jasmine --save-dev
$ npm install karma-jasmine --save-dev
(die save-dev zorgt ervoor dat karma als een developer dependency wordt behandeld

$npm install karma-jasmine karma-chrome-launcher --save-dev
(was npm install karma-chrome-launcher --save-dev)

en globaal de cli:
$ sudo  npm install -g karma-cli
(ik probeerde local en dan krijg je een warning dat ie global wil)


NPM en de packages bijwerken
-------------
sudo npm install -g npm    (npm zelf)
npm update -g  (gobal npm packages)

gulp-karma package verwijderen - ik denk dat gulp helemaal niet meer gebruik


Update van libraries
=============================
1) $ sudo npm update -g

2) $ bower list
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
Karma vanaf de cmd line runnen
vanuit de *test* folder:
$ karma start --single-run

Of via de termimal de testen continue runnen:
$ karma start karma.conf.js --auto-watch

De testen debuggen:
$ karma start karma.conf.js --auto-watch --debug
Klik dan op de karma DEBUG knop in de page. Open Chrome dev tools en zet een breakpoint en reload de page.

Mbv IntelliJ kan ook, karma plugin installeren en via rechtermuistoets runnen als je op karma file staat



Ionic runnen
--------------
$ ionic serve
(gebruik 'c' om de logs te zien)

Opvragen welke devices er zijn (shell script):
$ platforms/ios/cordova/lib/list-emulator-images

Ionic op specifiek device runnen:
$ ionic emulate ios --target="iPhone-5s"
$ ionic emulate ios --target="iPhone-6s"
$ ionic emulate ios --target="iPad-Air"
$ ionic emulate ios --target="iPad-Pro"


$ ionic emulate ios
(--livereload doet t sinds kort niet meer)


Debuggen
--------
De makkelijkste manier is via ionic -serve de console aan te zetten.
Chrome kan behoorlijk goed via dev tools de iphone simuleren - visueel.

Vervolgens kan je de iphone simulator gebruiken:  ionic emulate ios --target="iPhone-6s"
Start Safari op, in het menu kies je Develop | Simulator | Calcworks.
Je kan dan de Console tab de output zien.

Dit kan ook met het fysieke device door de iPhone via een kabel aan de mac te hangen en in Safari's
menu te kiezen:  Develop | iPhone van Stephan en dan (calcworks) index.html


Protractor
----------

installeren
$ sudo npm install -g protractor
$ webdriver-manager update

Instructies om te runnen:

1) Start de calcworks applicatie zodat er naar port 8100 geluisterd wordt
$ ionic serve

2) nieuwe shell, start selenium/webdriver server:
$ webdriver-manager start

3) nieuwe shell, start de test:
$ cd projects/calcworks/test/e2e/
$ protractor conf.js


Github
------
$ git push origin master

om intelliJ files niet meer te tracken:
$ git update-index --assume-unchanged .idea/workspace.xml

Ionic View
----------
$ ionic upload
email@gmail.com / <straat><huisnr>a

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
(Seashore werkt echter niet goed met tekst op retina beeldschermen...)
Daarna met ionic resources --splash de images gegenereert.
Alleen twee landscape ipad images zien er niet goed uit, hierbij verdwijnt de witte header en de footer.
(ik dacht dat doordat de Orientation op "portrait" staat er geen landscape images worden gegenereerd - maar dat is nu onduidelijk)

Font gebruikt in splash: arial rounded mt bold, 144 punts
Ik heb er voor gekozen om alles in kleine letter te doen - ondanks dat de naam in de appstore met een hoofdletter is.
Ik heb Paintbrush voor mac gekozen om de tekst te plaatsen

Text. The launch image is static, so any text you display in it won’t be localized.
Static launch images for all devices must include the status bar region.
The source image’s minimum dimensions should be 2208 x 2208 px

Screenshots
-----------
De screenshots die ik heb gemaakt met de iphone 6 simulator staan in de ./screenshots folder

5.5 inch moet je met de 6s-plus doen:
ionic emulate ios --target="iPhone-6s-Plus"


Instructies maken van een release voor deploy naar appstore
===========================================================

versie nummer ophogen in config.xml en tab-settings.html

controleer of alle console log statements in comment staan

$ ionic build --release    (ivm uglify)

Waarschijnlijk niet meer nodig:
In xcode moest ik t header path aanpassen om build errors te omzeilen.
 Add this line to your Build Settings -> Header Search Paths:
 "$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include"
 Don't replace the existing line that looks similar, that is still needed to be backwards compatible with Xcode 7 and Xcode 6.4.
Zie ook het screenshot in de ./screenshots folder

Maak een archive via Product | Archive

Ik kreeg via email een warning mbt push notifications. Dit is een (oud) probleem in Cordova, zou opgelost moeten worden.
zie http://stackoverflow.com/questions/26168713/cordova-app-that-doesnt-use-push-notifications-missing-push-notification-enti



XCode opties bij een Distributie maken
---------------------------------------
- menu Product | build for running
- validate build product aanvinken voor 1 keer (?)
- Info | iOS Deployment Target - kunnen we evt op 9.1 zetten - dit ivm glytch bij rendering
- Build | Build Options - op release
- Bij Devices heb ik Universal geselecteerd  (dit zit bij General info tab in Xcode)



Roadmap
=======



Issues
============



Bugs
-------
- is er ook een test die controleert of er na een calculatie of na opstarten geen delete mogelijk is?
- is cordova minified bij een release?



Improvements
--------------
- maak de = bij edit mode groen of zo, of evt verander de tekst in OK
- toon ... als er meer dan 2 decimalen zijn en maak het evt mogelijk om erop te klikken
- toon de expressie visueel duidelijker; de operator precedence zou je moeten visualiseren - meer/minder ruimte tussen. Deelstreep
- we moeten voor de ipad nog een setting zetten ivm splitscreen
- a trash icon bij settings
- moet de button met de . ook niet localised worden?
- misschien zou de remember btn link bij display moeten, heb je meer ruimte in de eerste panel


Feedback Carolien
-----------------
In de Active Sheet staat de uitkomst van de calculatie links en maar bij Sum en Max staat het getal rechts… Op zich geen probleem, maar doordat het onderscheid tussen die totalen en de berekeningen (lichtgrijze achtergrond versus wit) zo klein is, is het wat verwarrend.
·         In de oranje balk staat bij Reorder een plaatje met pijltjes door elkaar, maar als je de functie aanklikt komt er bij de berekenregels een ander symbool te staan: waarom niet hetzelfde plaatje? (Bij delete is dat wel zo) Sowieso is het plaatje met de drie streeptjes niet geschikt: dat betekent eigenlijk altijd ‘menu’.
·         Waarom werkt Reorder niet hetzelfde als Delete? Met niks (dus geen ellipsis plaatjes rechts in de regel) als je de functie niet actief is en plaatjes links als ie wel actief is?
·         Je kunt beide functies weer uitzetten door er nog een keer op te klikken, dat is duidelijker als je ze als een soort ingedrukte button weergeeft als ze actief zijn.
·         Je hebt nu eigenlijk twee menu balken: die met delete reorder bovenin zzen die met het schuifje, de ellipsis en Sum onderin. Ik snap niet helemaal waarom…
·         De ellipsis opent een pop-up menu. Daarvoor zou het plaatje met de drie streepjes (zie boven) misschien geschikter zijn en dat zou je dan links bovenin (denk dat dat links moet zijn bij Apple) naast de titel kunnen zetten.
·         Het schuifje en ‘Sum’ zijn allebei view-achtige functies. Die zouden ook in de (oranje) menubalk kunnen… Allebei als een zelfde soort toggle. Nu is de een een toggle switch (schuifje) en bij de ander verandert de kleur (van de tekst) als hij is ingeschakeld (sum). Ik vind het schuifje niet zo duidelijk; geeft helemaal niet aan wat er gaat gebeuren… misschien een plaatje van een histogram (dat is wat er wordt getoond als hij aan is toch?) gebruiken en dat van kleur laten veranderen? Eventueel zou je voor Sum/Max ook een teken/plaatje kunnen gebruiken, bijvoorbeeld: ∑


Opschonen
 iphone 4s support met css media queries
 branch maken en uitproberen
 zet t project lokaal in een dir calcgems. Evt ook de git repo renamen. Dit stellen we uit tot Ionic 2.
 use the using the controllerAs syntax
 upgrade naar ionic 1.2
   gebruik de nieuwe checkbox ipv de toggle: <ion-checkbox ng-model="test" ng-checked="test" ng-disabled="test">Disabled Directive</ion-checkbox>
 upgrade cordova
 plaats files mbt feature bij elkaar


Kleine features
 In de history a la Google Docs per 'today' en 'deze week' en 'deze maand' laten zien
 Bij het renamen van een sheet/calc was de tekst niet geselecteerd. Het is ook irritant dat toetsenbord niet meteen
 verschijnt.
 Better looking popup menus
 De notifications kunnen mooier. In het scherm sliden, time-out voor sluiten en ook met x kunnen closen
 better looking notifications (e.g. error message)


paste functionaliteit

laden van de sheets in de achtergrond als je een nieuwe start

run vanuit history.
Misschien dat je de updated tijd moet aanpassen of vragen of ie favorite moet worden zodat de macro niet per ongeluk
verwijderd wordt

navigeren naar vorige sheet vanuit header bar  <-  en  ->   of  als je erop klikt dan een keuze maken

de edit/rename popup zit te laag
gebruik $ionicModal.fromTemplateUrl('templates/select-calculation.html', {
                scope: null,
                animation: 'slide-in-up'

als je een expressie hebt zoals prijs x rente dan moet je die makkelijk uit elkaar kunnen trekken

opnieuw de config.xml aanmaken aan de hand van de laatste cordova versie (ook dit checken)

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

merk op dat als je alle sheets blijft bewerken binnen 30 dagen er niets verwijderd wordt

Misschien dat we bij groter dan miljoen in Ks moeten afbeelden?
het font van de expression kan kleiner worden als de inhoud groeit
het aantal decimalen instelbaar


nice-to-have
------------

Gebruik github als website ipv google docs. Het is alleen onduidelijk of je de hele repo moet clonen.
We kunnen een nieuwe repository maken (calcgems?). (zie http://blog.teamtreehouse.com/using-github-pages-to-host-your-website)
we kunnen hier evt ook de mobile versie draaien.

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


samen nemen van btns Delete en Reorder into Change. Bij actief maken dan de ... button kolom hidden

voor het emailen en de title is nog untitled dan de rename dlg tonen

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


USE CASES
uitgaven bijhouden op vakantie
Offerte maken
Koers conversie
Historische gegevens bijhouden, bijv #km gefietst of gelopen. Dan wil je per dag 2 waarden invoeren; tijd en aantal. Door (meta) data mogelijk te maken per item kan je n spreadsheet simuleren. Bij de sheet geef je je extra vars op. Die kan je dan per item invullen. Bij n export krijg je een spreadsheet.



Opnieuw schoon begonnen
------------------------
controleer node en npm versie. (npm -v en node -v)

verwijder alle local npm packages:
$ for package in `ls node_modules`; do npm uninstall $package; done;
(volgens mij zou t met npm list mooier zijn btw)

Ik heb t met de hand gedaan voor de global packages (sudo gaf problemen)
$ npm list -g --depth=0
en dan sudo uninstall -g <pck>

cordova, ionic, de simular bijwerken,

cordova ios platform verwijderen en weer toevoegen

wat doet deze:  "ionic-plugin-keyboard"  - kan ie handig zijn?

toevoegen  "karma": "^1.2.0"