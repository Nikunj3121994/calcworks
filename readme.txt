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

$bower update
dit had  niet zoveel effect. Angular-mocks bleef op dezelfde versie zitten. Dit komt doordat ionic een oude versie van Angular specificeerd in zijn bower.json
Wat wel effect had was:

$bower install angular-mocks --save
(ik moest wel met de hand de versie overriden)

updaten van ionic:
$ionic lib update


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

Issues
-----

overloop van grote getallen regelen

active sheet deleten vanuit lijst van sheets

je moet een calculation niet kunnen deleten als ie gebruikt wordt (ref integrity)

je kan een nieuwe active sheet maken en dan mag je niet in de calculator de laatste var gebruiken.
(door lastCalc te resetten en deze te gebruiken voor de last var name los je dit op)

als je een operator hebt ingetikt moet je een andere kunnen intikken die ahw een override doet, delete zou ook moeten werken

lijst van sheets update niet als je alle sheets verwijderd.

persisteren moet per sheet

limiet op aantal calculaties en aantal sheets (met name belangrijk als we gratis verspreiden)

om autofocus voor elkaar te krijgen:
For it to work with cordova you need to add this in your config.xml
<preference name="KeyboardDisplayRequiresUserAction" value="false" />

als je plus hebt gedrukt, moet je nog steeds op = kunnen klikken

lastVarName zou lastVarNumber moeten worden, veel simpeler

plus-min in combinatie met haakjes en zo is waarschijnlijk nog niet bugfree

decimal separator tonen en aantal decimalen instelbaar maken

achtergrond kleur bij sheet list loopt niet door

beep of vibrate bij fout in calculator

test schrijven voor filter bij calculator

bij aanzetten of activeren kunnen of een bepaalde tijdsperiode is verstreken en zo ja een nieuwe sheet maken.

aan settings tab een 'send feedback' toevoegen

killer-feature: maak t mogelijk om 1 var als input aan te wijzen (evt meerdere tzt) en 1 var als result/output.
Voeg dan een run icon toe aan een sheet. Dit toont popup met de input var(s)

de remember/pin zou niet mogen reageren als ie disabled is

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


Issues
-------

update libraries. Angular en misschien ook Ionic. Documenteer dit

als je van de actieve sheet naar de calculator gaat dan toont ie alle decimalen
Twee cijfers achter de komma. (Pro instelbaar)

gebruik x ipv *

verwijderen van een sheet ging niet goed, ik denk dat er geen event gestuurd werd om de display bij te werken

hernoemen van een variable gaat waarschijnlijk nu niet meer goed

de getallen moeten in display en expression een pixel hoger

een getal selecteren uit de active werkt op de telefoon niet goed

2500 =   werkt niet. Je zou dan hierna altijd geef n naam dlg kunnen tonen. Twee keer = achter elkaar is altijd naam geven
2500 + 0 kan ook niet
Nieuwe operator moet override vd huidige doen

Bij nieuwe var naam geven wordt de oude niet getoond

Links en rechts uitlijnen in de lijst

Delete van een item , de waarde invullen in andere items

Totaal v. e.  Sheet aan/uitzetten

Nieuw sheet actie scrolled met de lijst - is niet goed.

Naam geven v d actieve sheet

Als je vanuit history naar een oude sheet gaat dan zijn er 2 problemen:
Deze sheet zou de actieve moeten worden
Je kan op de hele sheet klikken, dit werkt niet lekker

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