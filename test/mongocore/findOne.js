var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.findOne',function () {

	beforeEach(function (done) {
		getDb()
		.then(function (db) {
			return db.collection('user').deleteMany({});
		})
		.then(function (user) {
			// console.log(user);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	})

	it('Should not throw errors on require',function (done) {
		expect(()=>{require('../../app/db/mongodb/core/findOne')}).to.not.throw(Error);
		done();
	});

	it('Should findOne the created document',function (done) {
		var findOne=require('../../app/db/mongodb/core/findOne');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insert({name:'Hello'})]);
		})
		.then(function (db) {
			// console.log(db[1]);
			return findOne(db[0],'user',{},{});
		})
		.then(function (user) {
			expect(user).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should work with projection param',function (done) {
		var findOne=require('../../app/db/mongodb/core/findOne');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insert({name:'World',password:'secret'})]);
		})
		.then(function (db) {
			// console.log(db[1]);
			return findOne(db[0],'user',{},{password:0});
		})
		.then(function (user) {
			expect(user).to.have.property('name','World');
			expect(user).to.not.have.property('password');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return null when no documents exist',function (done) {
		var findOne=require('../../app/db/mongodb/core/findOne');

		getDb()
		.then(function (db) {
			// console.log(db[1]);
			return findOne(db,'user',{},{});
		})
		.then(function (user) {
			expect(user).to.be.equal(null);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})