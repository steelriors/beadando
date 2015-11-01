# Beadandó dokumentáció
* Név: Kiss Gergő József
* Neptun: ENHS34
* Tanár: Kereszti Zalán
* Csoport: Csütörtök 8.30

----

## Követelményanalízis

Cél egy webes alkalmazás elkészítése szerveroldali technológiák segítségével.
Az alkalmazás egy lemezkiadónak készül, ahol regisztráció után az oldalra bejelentkezve
rendelést adhatunk le, ahol megadjuk a címünket és a rendelni kívánt előadó-lemezcím párost.
Ezenkívül célunk az is, hogy a beküldött rendelést módunkban álljon törölni és/vagy módosítani is.

#### Elvárások
- legalább két modell, egy-sok kapcsolatban
- legalább 1 űrlap
- legalább 1 listázó oldal
- legyen lehetőség új felvételére
- legyen lehetőség meglévő szerkesztésére
- legyen lehetőség meglévő törlésére
- legyenek benne csak hitelesítés után elérhető funkciók
- perzisztálás fájlba történjen
- közzététel Herokun
#### Használati eset diagram:
- A használati eset neve: Szimuláció
- Leírás: Az alábbi szimulációban nyomonkövethetjük egy új felhasználó létrehozását és a program további használatát.
- Előfeltétel: Stabil internet kapcsolat, form-ok helyes kitöltése.
- Utófeltétel: Inaktivitás esetén az alkalmazás kijelentkeztet, így újból be kell lépnünk a folytatáshoz.

![Használati eset diagramm](http://s14.postimg.org/hd6vjkm9d/Hasznalat_eset_diag.png)
![Kép felirata](docs/images/Hasznalat_eset_diag.png)


## Tervezés

## Implementáció
###1. Fejlesztői környezet bemutatása
####1.1
Cloud9 használata, amely egy ingyenes internetes kódszerkesztő. Megkönnyíti a kód megosztását, tárolását. Lehet publikus és privát kódot is létrehozni, valamint bárkivel megosztható az adott project.
Könnyen kezelhető, angol nyelvű és a projectek egyben le is tölthetőek illetve fájlokat és mappákat is könnyedén lehet fel és letölteni.
Ezenkívül a kódunkat könnyedén futtathatjuk, tesztelhetjük és kipróbálhatjuk a C9 segítségével, ami a https://c9.io -n érhető el és ha az adott felhasználónevet '/' jellel utána tesszük, akkor láthatjuk a user workspaceit.
Mint például az enyémet: https://c9.io/steelriors
####1.2
A Cloud9-on belül Node.js használata. A Node.js egy szoftverrendszer, melyet skálázható internetes alkalmazások, mégpedig webszerverek készítésére hoztak létre. A programok JavaScript-ben írhatóak, eseményalapú, aszinkron I/O-val a túlterhelés minimalizálására és a skálázhatóság maximalizálására
A Node.js a Google-féle V8 JavaScript-motorból, a libUV-ből és számos beépített könyvtárból áll.
Ryan Dahl hozta létre 2009 januárjában, a növekedését pedig a Joyent, Dahl munkaadója támogatja.
Dahl eredeti célja az volt, hogy lehessen weboldalakat push technológiával létrehozni, ahogy például a Gmail alkalmazásban is látható.

###2. Könyvtárstruktúrában lévő mappák funkciójának bemutatása
- Ha belépünk egy adott projectben, akkor láthatjuk, hogy van egy fő mappa, ami a project neve. Ez alatt találhatóak almappák, melyből az egyik fontos
a node_moduls, hiszen ha commandline-ban telepítünk különböző modulokat, mint például hbs, passport, zombie... akkor azokat ebben a mappában tároljuk és így ha szeretnénk bármelyiket használ akkor könnyen megtalálhatóak és elérhetőek.
- Érdemes szétbontani a backend-frontendet, így találhatunk még controllers views(viewmodel,views) valamint models mappát is.
- Amire még szükség van, hely ahol a css-t tároljuk, (public & bower_components) és egy config mappára is.
- A fő mappában pedig a server.js foglal helyet, amit futtathatunk ha a programunkat ki szeretnénk próbálni, valamint egy README.md a dokumentáció tárolására és egy bower.json

## Tesztelés
index.test:
```
var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
    
    it('should see welcome page', function() {
        browser.assert.text('div.page-header > h1', 'Lemezrendelés');
    });
});

```
user.test:
```
var expect = require("chai").expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('./user');
var errorCollection = require('./error');

var User;

before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(errorCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {

    function getUserData() {
        return {
            felhasznalo_nev: 'abc123',
            password: 'jelszo1',
            surname: 'Kovács',
            forename: 'Béla',
            avatar: '',
        };
    }

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });
    
    it('should be able to create a user', function () {
        return User.create({
                felhasznalo_nev: 'abc123',
                password: 'jelszo1',
                surname: 'Kovács',
                forename: 'Béla',
                avatar: '',
        })
        .then(function (user) {
            expect(user.felhasznalo_nev).to.equal('abc123');
            expect(bcrypt.compareSync('jelszo1', user.password)).to.be.true;
            expect(user.surname).to.equal('Kovács');
            expect(user.forename).to.equal('Béla');
            expect(user.avatar).to.equal('');
        });
    });

    it('should be able to find a user', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByNeptun(user.neptun);
        })
        .then(function (user) {
            expect(user.felhasznalo_nev).to.equal('abc123');
            expect(bcrypt.compareSync('jelszo1', user.password)).to.be.true;
            expect(user.surname).to.equal('Kovács');
            expect(user.forename).to.equal('Béla');
            expect(user.avatar).to.equal('');
        });
    });

    describe('#validPassword', function() {
        it('should return true with right password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('jelszo')).to.be.true;
             })
        });
        it('should return false with wrong password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('titkos')).to.be.false;
             })
        });
    });

});

```
## Felhasználói dokumentáció

- Fejlesztési módszertan:
Egységesített Eljárás
- A fejlesztéshez tesztelt hardver:
CPU: Intel(R) Core(TM) i5-2410M CPU @ 2,30GHz 2.30 GHz , 
RAM: 8,00 GB, videó: 1366x768
- A fejlesztéshez használt szoftverek:
Operációs rendszer: Windows 7 Ultimate 64 bit
- Követelmény elemzés: Word szövegszerkesztővel, dokumentum-sablonok használatával
Cloud9 & node.js fejlesztői környezet.
- A futtatáshoz szükséges operációs rendszer:
Tetszőleges operációs rendszer.
- A futtatáshoz szükséges hardver:
Operációs rendszerek szerint megadva
- Egyéb: 
Intuitív felhasználói felület, könnyű kezelhetőség

