
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
